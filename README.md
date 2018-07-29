# proton-hot-cli

Hot Reloading for [proton-native](https://github.com/kusti8/proton-native).

For an example, take a look at [proton-hot-example](https://github.com/mischnic/proton-hot-example)

```

  Usage: proton-hot-cli <main.js>

  Run `main.js` with proton-native hot reloading (similar to babel-node)

  Options:

    -o, --out_dir <n>  The output directory. Default: './build'
    -h, --help         output usage information

```

You can disable hot reloading (for both imported and exported components) on a per-file basis:
```js
// @proton-hot-disable
import ...
```

**Please open an issue in https://github.com/mischnic/babel-plugin-proton-hot with any code that isn't working as expected (e.g. not working at all/crashing or not hot reloading). There *should* be a test for every edge-case regarding component importing and exporting.**
