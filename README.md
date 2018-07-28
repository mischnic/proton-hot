# proton-hot-cli

Hot Reloading for [proton-native](https://github.com/kusti8/proton-native).

For an example, take a look at [proton-hot-example](https://github.com/mischnic/proton-hot-example)

```

  Usage: proton-hot-cli <main>

  Run `main` with proton-native hot reloading (similar to babel-node)

  Options:

    -o, --out_dir <n>  The output directory. Default: './build'
    -h, --help         output usage information
```

You can disable hot reloading (for both imported and exported components) on a per-file basis:
```js
// @proton-hot-disable
import ...
```