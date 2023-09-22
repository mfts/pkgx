# `pkgx` & Scripting

## shebangs

You can use `pkgx` as the [shebang] for your scripts:

```python
#!/usr/bin/env -S pkgx python@3.9

import sys

print(sys.version)
```

```sh
$ chmod +x ./my-script.py
$ ./my-script.py
3.9.17
```

{% hint style="info" %}
Using `env` to invoke `pkgx` is typical for tools that have no POSIX location.

The `-S` parameter is required to pass multiple arguments.
{% endhint %}


### Including Additional pkgs

Scripts are the glue that allows open source to be composed into powerful new
tools. With our `+pkg` syntax you make anything in open source available to
your your script.

```sh
#!/usr/bin/env -S pkgx +openssl deno run

Deno.dlopen("libssl.dylib")
```

## Shell Scripting

```sh
#!/bin/sh

eval "$(pkgx --shellcode)"
# ^^ integrates `pkgx` during this script execution

pkgx +openai-python
# ^^ requires integration

openai --version
```

Robustness requires precisely specifying your environment:

```sh
#!/usr/bin/env -S pkgx bash>=4

source <(pkgx --shellcode)
# ^^ bash >=4 is required for this syntax, and eg macOS only comes with bash 3
```

{% hint style="info" %}

### Super Portable Scripts

If you like you can use our cURL-installer in your scripts. If `pkgx` is
installed then the script just exits and uses that `pkgx`, if it’s not
installed, it installs pkgx to a **temporary directory** first.

```sh
#!/bin/sh

eval "$(curl -Ssf https://pkgx.xyz)"

which pkgx   #=> /tmp/pkgx.xyz/pkgx
echo $PATH  #=> /tmp/pkgx.xyz:$PATH

pkgx +node@16 which node  #=> /tmp/pkgx.xyz/nodejs.org/v16/bin/node
```

{% endhint %}


[shebang]: https://en.wikipedia.org/wiki/Shebang_(Unix)
