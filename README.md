# epp-reg

A client for [nodepp](https://github.com/heytrav/nodepp)

# Description

This provides a helper class as well as some command line scripts that
interact with [nodepp](https://github.com/heytrav/nodepp).

Please see [nodepp](https://github.com/heytrav/nodepp) for a detailed description of
commands.


# Dependencies

1.  An instance of RabbitMQ. 
2.  `nodepp` installed, running and connected to RabbitMQ.



# Installation

    git clone https://github.com/heytrav/epp-reg.git
    cd epp-reg
    npm install

# Configuration

The configuration is primarily to connect to your RabbitMQ interface.  There
is an example configuration in `config/epp-reg-example.json`. I recommend
copying this for the respective environment (i.e. `production` or
`development`) and editing that file to fit your needs. Once the configuration
is setup, symlink it to `config/epp-reg.json`:

    ln -sf `pwd`/config/epp-reg-devel.json `pwd`/config/epp-reg.json



# Using the EppCommander class

The following code shows how the `lib/create-domain.js` script does a
check domain first and only tries to create the domain if it is actually
available.


```javascript
eppCommander.checkDomain({domain: "test-domain.co.nz"})
    .then(function(checkResult) {
        // first check for domain availability
        var isAvailable
            = checkResult.data['domain:chkData']['domain:cd']['domain:name'].avail;
        if (!isAvailable) {
            // if not available, throw an exception.
            //skips directly to .fail block
            throw new Error("Domain is not available");
        } else {
            // modify createDomain data if necessary and pass on to
            // next "then"
            return data;
        }
    })
    .then(function(data) {
        // data from previous "then" block. Not really needed in this //
        // example.If an exception is thrown it will go directly to "fail" //
        // block
        return eppCommander.createDomain(
        {
            domain: "test-domain.com",
            registrant: "iwmn-12345",
            period: {"value": 1, "unit": "y"},
            ns: [
                "ns1.hexonet.net",
                "ns2.hexonet.net"
            ],
            contact:[
                {admin: "iwmn-admin-1"},
                {tech: "iwmn-tech-1"}
            ]
        });
    })
    .then(function(data) {
        console.log("Created domain: ", domain);
        console.log("Expires: ", data.data["domain:creData"]["domain:exDate"]);
    })
    .fail(function(error){
        console.error("Unable to register domain: ", error);
        // handle failure: cleanup db, etc.
    });
```

Note that all commands return a *promise* object. That means that it is
possible to chain commands together. Each successful block will be passed to
the next `then` block. If an exception is thrown in the chain somewhere it
will go directly to the `fail` block. Think of this as an async equivalent of a
`try/catch` block.




# Testing

    npm test

*Note* as the implementation requires an up and running
[nodepp](https://github.com/heytrav/epp-reg.git), which itself must be
configured with login information to specific, the tests in this app
will likely fail. Some have been intentionally set to *skip* for this reason. 


# Command line scripts

To make it easier to experiment with some commands, there are a few command
line scripts for interacting with EPP. Here are a some that I've completed so
far:

## create-contact.js

      node lib/create-contact.js -r registry1 \
            --id 'P-43994' \ # optional. will default to iwmn-<unix timestamp>
            --name 'Joe User' \
            --email joeuser@null.com \
            --street '742 Evergreen Terrace' \
            --street 'Apt. b'
            --country 'Springfield' \
            --state Florida \
            --telephone '+1.123456789' \
            --postcode 25000 \
            --country USA


## update-contact.js

        node lib/update-contact.js -r registry1 -i iwmn-tech-1 \
            --telephone '+64.1234567'
            --street '167 Vivian' \
            --street 'Apt. b' \
            --city 'Wellington' \
            --state 'Wellington' \
            --country NZ   \
            --postcode 6011

Note that with update it is necessary to *always* provide the address data.
With *email*, *telephone*, *fax*, *name* it is only necessary to provide stuff
that is being changed.


## delete-contact.js

        node lib/delete-contact.js -r registry1 --id iwmn-tech-3

## create-domain.js

See #Synopsis above for an idea how this works.

    node lib/create-domain.js -r registry1 \
        --name test-6-iwmn.co.nz \
        --registrant iwmn-1409280841 \
        --admin iwmn-1409280485 \
        --tech iwmn-1409280762  \
        --nameserver 'ns1.hexonet.net' \
        --nameserver 'ns2.hexonet.net' \
        --nsobj 'ns.test-6-iwmn.co.nz;23.44.23.12' \ # Glue record!
        --period 1  \
        --unit y


Output:

        Created domain:  test-6-iwmn.co.nz
        Expires:  2015-08-29T21:55:12+12:00

or if there was an error (eg. the domain is already registered):

        Unable to register domain:  [Error: Domain is not available]

Note that some options (`--nameserver`, `--admin`, `--tech`, `--billing`) can
be entered multiple times.


## info-domain.js


        node lib/info-domain.js -d test-4-iwmn.co.nz -r registry1

Output:
```javascript
{ 
  'xmlns:domain': 'urn:ietf:params:xml:ns:domain-1.0',
    'domain:name': 'test-4-iwmn.co.nz',
    'domain:roid': 'd95928bbc4a0-DOM',
    'domain:status': { lang: 'en', s: 'ok' },
    'domain:ns': { 'domain:hostAttr': [Object] },
    'domain:clID': {},
    'domain:crDate': '2014-08-29T21:51:34+12:00',
    'domain:exDate': '2015-08-29T21:51:34+12:00' 
} 
```

## update-domain.js

        node lib/update-domain.js -r registry1 \
            -d test-4-iwmn.co.nz \
            --admin iwmn-admin-1   \ # admincontact to add
            --admin iwmn-admin-2   \ # add another admin
            --remadmin  iwmn-1409280485 \ # admin to remove
            #IPv6 record
            --nsobj 'ns1.trav-test-4-iwmn.co.nz;2001:0DB8:AC10:FE01::=v6' \
            --remns ns2.hexonet.net \ # nameserver to remove
            --registrant iwmn-12345 \ # new registrant
            --period 24  \# change to 24 month registration
            --status 'clientHold:Payment Due' \ # add a status
            --remstatus 'transferBlock' \ # remove a status
            --unit m

**Note** nsobj syntax for specifying IPv4 and IPv6 addresses (also for
`lib/create-domain.js`). `=v6` is necessary to specify **IPv6** addresses.
Default will always be **IPv4**.


## renew-domain.js

Renew domain for a 2 month period:


        node lib/renew-domain.js -r registry1 \
            -d test-5-iwmn.co.nz
            --expiration 2014-10-01
            --period 2
            --unit m

## delete-domain.js


        node lib/delete-domain.js -r registry1  -d test-6-domain.co.nz

## transfer-domain.js

        node lib/transfer-domain.js -r registry2  -d test-6-domain.co.nz \
            --op request --authinfo 6aWZpy5E

**Note** that domain transfers are blocked for a period of 5 days following
registration (1 day on test systems).


## poll-cli.js
This is used to iteratively retrieve queued messages from the registry. The
nature of these messages depends on the registry and can vary wildly.

        node lib/poll-cli.js -r registry1

Output:

        Remaining messages:   2
        next message id:    0195iwmn-1409306037
        Poll msg:   Domain Create
        Received data:  { 'xmlns:domain': 'urn:ietf:params:xml:ns:domain-1.0',
        'domain:name': 'test-5-iwmn.co.nz',
        'domain:roid': '3fd1074ac89c-DOM',
        'domain:status': { lang: 'en', s: 'ok' },
        'domain:registrant': 'iwmn-1409280841',
        'domain:contact':
        [ { type: 'admin', '$t': 'iwmn-1409280485' },
            { type: 'tech', '$t': 'iwmn-1409280762' } ],
        'domain:ns': { 'domain:hostAttr': [ [Object], [Object] ] },
        'domain:clID': 195,
        'domain:crDate': '2014-08-29T21:53:57+12:00',
        'domain:exDate': '2015-08-29T21:53:57+12:00',
        'domain:authInfo': { 'domain:pw': 'FMMhQJHZ' } }

To dequeue that message:

        node lib/poll-cli.js -r registry1 -i 0195iwmn-1409306037

Output:

        Remaining messages:   1

