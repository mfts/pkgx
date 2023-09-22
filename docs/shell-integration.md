# Shell Integration

`pkgx +pkg` creates temporary, isolated *package environments* for you to run
commands in.

```sh
$ pkgx +node
(+node) $ node --version
v20.5.1
```

{% hint style="info" %}
The `(+pkg)` that prefixes your prompt indicates your terminal’s environment
has been supplemented with the named pkgs.
{% endhint %}

{% hint style="warning" %}
You need to `pkgx integrate` once to get our shell integration, but commands
that require it will tell you that so don’t worry about doing it until you
need it.
{% endhint %}

Package environments created with `pkgx +pkg` do not persist beyond the current
terminal session. All the same if you need to remove pkgs from your
current session use `pkgx -pkg`.


## Creating Environments for Specific Versions

```sh
$ pkgx +deno@1.33
(pkgx) $ deno --version
deno 1.33.4
```

{% hint style="info" %}
When you create environments the packages you request are installed if
necessary.
{% endhint %}


## Creating Environments for Multiple pkgs

```sh
$ pkgx +node@16 +imagemagick +optipng
```


# Installing the Shell Integration

The first time you try to use a command that requires shell integration `pkgx`
will let you know:

```sh
$ pkgx +node
pkgx: error: shellcode not loaded
pkgx: ^^run: eval "$(pkgx integrate)"
```

Integration is minimal. We write one line to your `.shellrc` that adds a few
functions to your shell environment. If you like check it out first:

```sh
pkgx --shellcode
```

If you like what you see then you can see what integrate will do in a dry run:

```sh
pkgx integrate --dry-run
```

And then finally integrate:

```sh
$ eval "$(pkgx integrate)"

$ pkgx +node
(+node) $ node --version
Node.js v20.5.0
```

{% hint style="info" %}
`source`ing the integration means you can immediately start using it, but if
you prefer you can run `pkgx integrate` by itself—it’s just the integration
won’t start working until you start a new terminal session.
{% endhint %}

{% hint style="warning" %}
Once integrated every terminal session will have `pkgx` integration.
If for some reason you need a session without this integration you can unload:

```sh
pkgx unload
```

{% endhint %}

{% hint style="info" %}
To deintegrate `pkgx`’s shellcode you can either:

1. Run `pkgx deintegrate`; or
2. Open your `~/.shellrc` file in an editor and remove our one-liner
{% endhint %}
