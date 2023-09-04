# YouTube GPT Translator (中文版)

YouTube AI Translator 是一个简单的 Chrome 扩展 (manifest v3)，它使用 OpenAI 的 ChatGPT AI 技术，让你能够获取 YouTube 视频的语音转换中英文文本，并对陌生单词进行标注解释的英文学习助手。

## 如何安装

要安装这个扩展，请按照以下步骤进行操作：

1. 在 GitHub 上下载源代码。
2. 解压下载的文件。
3. 在你喜欢的 IDE（如 VS Code）中打开代码。
4. 在终端中运行 `npm install`。
```
npm install
```
5. 运行 `npm run build` 或 `npm run build-release` 来运行 webpack 以生成 **dist** 文件夹。
```
npm run build
# 或者
npm run build-release
```
6. 对于 Google Chrome 浏览器，打开扩展页面（chrome://extensions/）。
7. 在页面右上角点击切换开发者模式的开关。
8. 点击 `Load unpacked` 按钮，选择 **dist** 目录。
9. YouTube Summary with ChatGPT 扩展应该已经成功安装并且处于活动状态！

## 如何使用

要使用 YouTube Summary with ChatGPT 扩展，按照以下步骤进行操作（或者 [观看此视频](https://www.youtube.com/watch?v=pNxsdLif2cs)）：

1. 转到任何 YouTube 视频页面。
2. 点击右上角的小框，上面写着 `Transcript & Summary`。
3. 点击 `View AI Summary` 按钮（它会自动复制提示并打开 ChatGPT 页面！）。
4. 如果你使用 Mac，按下 `Cmd + V`。
5. 你将会看到奇迹发生！

## 注意事项

- 本项目是基于YouTube Summary with ChatGPT Fork出来的开源项目
- 本项目高度依赖于YouTube、OpenAI和Google官方产品，不保证永远有效
- 本项目在中国大陆境内使用时请遵守相关法律法规

## 反馈与支持

如果你对 YouTube AI Translator 扩展有任何问题或反馈，请在发生Email:lewis.q.zhang@gmail.com给我
本项目Fork自[YouTube_Summary_with_ChatGPT](https://github.com/kazuki-sf/YouTube_Summary_with_ChatGPT)，感谢kazuki-sf对开源社区的贡献。