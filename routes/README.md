# Show an problem in fastify-multipart

It seems like fastify-multipart is not handling canceld uploads
correctly. When the upload is canceled, I would expect my code path
to throw an exception or at least go through the finally part of my
try/catch block in the route to be able to clean up my behaviour

## To reproduce

- yarn install/yarn dev
- `curl -i --limit-rate 100k -w '%{http_code}\n' -F video=@bigfile.binary -F events=@anotherbigfile.binary http://localhost:3000/upload `
- Terminate curl before request has gone through

## Expected behaviour

- In the code, the `finally` and the `catch` part should be called

## Actual behaviour

- The code parts are never reached

## Proposed fix

Similar to fastify-multipart, enable a `close` handler on the `request.raw` and `destroy` the current read file. This seems hacky but does produce the error I'm looking for.
