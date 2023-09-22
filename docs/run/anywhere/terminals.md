# Getting Started

Installing with [`brew`] is most straight forward:

```sh
brew install teaxyz/pkgs/pkgx-cli
```

# Other Ways to Install

1. After `brew` our installer is easiest:

```sh
curl -fsS https://pkgx.xyz | sh
```

{% hint style='info' %}
Wanna read that script before you run it? [github.com/teaxyz/setup/installer.sh][installer]
{% endhint %}

&nbsp;

2. `pkgx` is a standalone binary, so (if you want) you can just download it directly:

```sh
# download it to `./pkgx`
curl -o ./pkgx --compressed -f --proto '=https' https://pkgx.xyz/$(uname)/$(uname -m)

# install it to `/usr/local/bin/pkgx`
sudo install -m 755 pkgx /usr/local/bin

# check it works
pkgx --help
```

For your convenience we provide a `.tgz` so you can one-liner that:

```sh
curl -Ssf https://pkgx.xyz/$(uname)/$(uname -m).tgz | sudo tar xz -C /usr/local/bin
```

&nbsp;

3. You can also download straight from [GitHub Releases].

{% hint style='warning' %}
If you download manually you’ll need to move the binary somewhere in
your `PATH`.
{% endhint %}


[`brew`]: https://brew.sh
[GitHub Releases]: https://github.com/teaxyz/cli/releases
[installer]: https://github.com/teaxyz/setup/blob/main/installer.sh
