# YouTube GPT Translator for Chinese

<p align="center">
  <em>可能是东半球最好的YouTube字幕插件</em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/manifest-v3-blue" alt="python">
    <img src="https://img.shields.io/badge/chrome-116-red" alt="python">
</p>

"**YouTube AI Translator for Chinese** is a simple Chrome extension (manifest v3) based on OpenAI's ChatGPT AI technology. It enables real-time translation of English videos and allows for easy copying and pasting of video subtitles. For English learners, this plugin provides Chinese definitions for key words or phrases in the videos. For friends practicing English listening skills, subtitles can be selected for repeated playback and practice. In the future, we will also develop additional features such as video content summaries and one-click generation of video content mind maps. Stay tuned for more updates."

**YouTube AI Translator for Chinese** 是一个简单的 Chrome 扩展 (manifest v3)，基于 OpenAI 的 ChatGPT AI 技术
能够让您实时翻译英文视频，亦可对视频字幕内容一键复制粘贴。对于英语学习者来说，本插件可对视频中关键单词或短语进行中文释义，
对于练习英文听力的朋友，可选择字幕进行反复播放练习。后续我们还会开发视频内容总结和视频内容思维导图一键生成等功能，敬请期待。

## 安装

### 开发者安装
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

### 普通安装
请在**Chrome Store**中搜索**YouTube GPT Translator for Chinese**

## 如何使用

1. 安装成功后打开任一YouTube英文视频，右侧页面会插入`YouTube GPT Translator`插件。
2. 点击浏览器右上角的插件ICON填入您的`OpenAI API KEY`.
3. 点击页面插件的下拉按钮，会显示全部英文字母。
4. 点击`段落翻译`：翻译整段翻译；
5. 点击`词法分析`：会翻译出段落中的重点短语；
6. 点击字幕原文，视频会自动滚动到该字幕的位置；
7. 点击`暂停/播放`按钮，视频会在暂停播放间切换；
8. 点击`复制全部字幕`按钮，视频字幕会自动复制到您电脑的粘贴板上，您可以粘贴到任意您所需的地方。

## 注意事项

- 本项目是基于YouTube Summary with ChatGPT Fork出来的开源项目
- 本项目高度依赖于YouTube、OpenAI和Google官方产品，不保证永远有效
- 本项目在中国大陆境内使用时请遵守相关法律法规

## 反馈与支持

如果你对 YouTube AI Translator 扩展有任何问题或反馈，请在发生Email:lewis.q.zhang@gmail.com给我
本项目Fork自[YouTube_Summary_with_ChatGPT](https://github.com/kazuki-sf/YouTube_Summary_with_ChatGPT)，感谢kazuki-sf对开源社区的贡献。