/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const Mcs = require('metro-code-split');

// 拆包的配置
const mcs = new Mcs({
  output: {
    // 配置你的 CDN 的 BaseURL
    publicPath: 'https://static001.geekbang.org/resource/rn',
  },
  dll: {
    entry: ['react-native', 'react'], // 要内置的 npm 库
    referenceDir: './public/dll', // 拆包的路径
  },
  dynamicImports: {}, // dynamic import 是默认开启的
});

const busineConfig = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports =
  process.env.NODE_ENV === 'production'
    ? mcs.mergeTo(busineConfig)
    : busineConfig;
