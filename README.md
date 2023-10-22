# TubeX：YouTube AI Copilot

<div align="center">
  <img src="./src/images/icon.png" width="200"/>
</div>
<p align="center">
  <em>A Free and open-source Youtube Copilot extension on Chrome</em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/manifest-v3-blue" alt="python">
    <img src="https://img.shields.io/badge/chrome-116-red" alt="python">
</p>

**TubeX** is an open-source YouTube Copilot that supports translation in 24 mainstream languages worldwide. It comes with built-in Google and GPT3.5 engines. You can directly use chatGPT on the YouTube web interface to request custom tasks such as generating outlines and summaries based on the current video according to your needs. Our vision is to enable people from different countries to overcome language barriers and communicate through videos.We hope that one day, the little girls in Afghanistan can watch open courses from Stanford University, and students from Palestine and Israel can sit together and discuss artificial intelligence. Technology should be used to disseminate knowledge rather than manufacture ammunition.

> Yet the GPT API is still unstable, which may result in you only being able to use the Google Translate engine during your usage.

## Set Your GPT API Key

Open `background.js` file and input your api key into **key** varible.

## Installation 

### Developer Installation 

To install this extension, follow these steps:

1. Download the source code from GitHub.
2. Extract the downloaded files. 
3. Open the code in your preferred IDE (e.g. VS Code). 
4. Run npm install in the terminal. 

```
npm install
```

5. `npm run build` 或 `npm run build-release` to run webpack and generate the dist folder.

```

npm run build
# or
npm run build-release
```

6. For Google Chrome browser, open the extensions page（chrome://extensions/）  
7. Click the switch on the top right corner of the page to enable developer mode. 
8. Click the Load unpacked button and select the dist directory.
9. Open YouTube website and the Hercules extension should now be successfully installed and active! 

### Installation from Chrome Store


[Chrome Store](https://chrome.google.com/webstore/detail/tubex-your-youtube-ai-cop/bifndkhccndcnabjhllngpdapfakfcif?hl=zh-CN&authuser=0)

[TubeX Website](https://hercules.ink)

## Notice 

- This project is a fork of YouTube Summary with ChatGPT and is an open-source project.
- This project heavily relies on YouTube, OpenAI, and Google official products, and there is no guarantee of its perpetual effectiveness.
- When using this project in mainland China, please comply with relevant laws and regulations.

## Feedback and Support 

If you have any questions or feedback regarding the YouTube AI Translator extension, please feel free to email me at lewis.q.zhang@gmail.com.

This project is forked from [YouTube_Summary_with_ChatGPT](https://github.com/kazuki-sf/YouTube_Summary_with_ChatGPT), and special thanks to kazuki-sf for their contribution to the open-source community.

