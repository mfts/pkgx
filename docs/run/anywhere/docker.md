# `pkgx` & Docker

We provide an image based on Debian Buster (slim) preloaded with `pkgx`:

```sh
$ docker run -it teaxyz/cli
$ pkgx +node@16
$ npm start
```

You can use this as a base:

```Dockerfile
FROM teaxyz/cli
RUN pkgx +node@16
RUN npm start
```

Or if you want to use `pkgx` in another image:

```Dockerfile
FROM archlinux
RUN eval "$(curl -Ssf --proto '=https' https://pkgx.xyz)"
RUN pkgx +node@16
RUN npm start
```

`eval`ing our one-liner also integrates `pkgx` with the container’s shell.
If you don’t want that you can `curl -Ssf pkgx.xyz | sh` instead.


{% hint style="success" %}
We have binaries for Linux aarch64 (arm64) thus Docker on your Apple Silicon
Mac is as fast and easy as deployments.
{% endhint %}
