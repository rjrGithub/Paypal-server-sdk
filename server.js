const express = require('express');
const request = require('request');

const port = 8000;
const app = express();

const routes = function(app) {
    var CLIENT = 'AS-RbHoqg_7BJf-dVUfmvg7FucVKX2oIoqln0p5I7ZGP_XWOhh7Fs-1Mbp_n61DuK_dw7vkF9r12FAra';
    var SECRET = 'ELmhOm7521G3xelEmJ86qpaTl-JgJ4RrPKAWm-KfoqNPY5mxh3gnXjuNIlHzJQtaD_uBCZjhTA81OSM7';
    var PAYPAL_API = 'https://api-m.sandbox.paypal.com';
    app.post('/create-payment', async (req, res) => {
        request.post(PAYPAL_API + '/v1/payments/payment',
        {
          auth:
          {
            user: CLIENT,
            pass: SECRET
          },
          body:
          {
            intent: 'sale',
            payer:
            {
              payment_method: 'paypal'
            },
            transactions: [
            {
              amount:
              {
                total: '5.99',
                currency: 'USD'
              }
            }],
            redirect_urls:
            {
              return_url: 'https://example.com',
              cancel_url: 'https://example.com'
            }
          },
          json: true
        }, function(err, response)
        {
          if (err)
          {
            console.error(err);
            return res.sendStatus(500);
          }
          // 3. Return the payment ID to the client
          res.json(
          {
            id: response.body.id
          });        
        });
    });

    app.post('/execute-payment', async(req, res) => {
        var paymentID = req.body.paymentID;
        var payerID = req.body.payerID;
        // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
          '/execute',
          {
            auth:
            {
              user: CLIENT,
              pass: SECRET
            },
            body:
            {
              payer_id: payerID,
              transactions: [
              {
                amount:
                {
                  total: '5.99',
                  currency: 'USD'
                }
              }]
            },
            json: true
          },
          function(err, response)
          {
            if (err)
            {
              console.error(err);
              return res.sendStatus(500);
            }
            // 4. Return a success response to the client
            res.json(
            {
              status: 'success'
            });
          });        
    })
}

routes(app);

app.listen(port, () => {
    console.log("Server is running @ port " + port);
})