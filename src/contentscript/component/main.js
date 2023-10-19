const main = `
    <div class="hercules_container">
    <div id="yt_ai_summary_header" class="yt_ai_summary_header">
        <select class="yt_ai_header_text" id="yt_ai_header_text">
        <select>
        </p>
        <div class="yt_ai_header_actions">     
            <div id="hercules_translate" class="hercules_header_action_btn hercules-hover-el" data-hover-label="Google translate">
                <svg viewBox="64 64 896 896" focusable="false" data-icon="translation" width="22" height="22" style="filter: brightness(0.95);" fill="#828282" aria-hidden="true">
                    <defs>
                    <style>
                    </style>
                    </defs>
                    <path d="M140 188h584v164h76V144c0-17.7-14.3-32-32-32H96c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h544v-76H140V188z"></path><path d="M414.3 256h-60.6c-3.4 0-6.4 2.2-7.6 5.4L219 629.4c-.3.8-.4 1.7-.4 2.6 0 4.4 3.6 8 8 8h55.1c3.4 0 6.4-2.2 7.6-5.4L322 540h196.2L422 261.4a8.42 8.42 0 00-7.7-5.4zm12.4 228h-85.5L384 360.2 426.7 484zM936 528H800v-93c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v93H592c-13.3 0-24 10.7-24 24v176c0 13.3 10.7 24 24 24h136v152c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V752h136c13.3 0 24-10.7 24-24V552c0-13.3-10.7-24-24-24zM728 680h-88v-80h88v80zm160 0h-88v-80h88v80z">
                    </path>
                </svg>
            </div>
            <div id="hercules_gpt" class="hercules_header_action_btn hercules-hover-el" data-hover-label="GPT Translate">
                <svg style="filter: brightness(0.95);" fill="#828282" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>
            </div>
         
            <div style="filter: brightness(0.9);" class="hercules_header_action_btn hercules-hover-el" id="yt_ai_header_chat" 
                 data-hover-label="Chat">
                <svg viewBox="64 64 896 896" focusable="false" data-icon="comment" width="22" height="22" style="filter: brightness(0.95);" fill="#828282" aria-hidden="true"><defs><style></style></defs><path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zm-280 0c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"></path><path d="M894 345a343.92 343.92 0 00-189-130v.1c-17.1-19-36.4-36.5-58-52.1-163.7-119-393.5-82.7-513 81-96.3 133-92.2 311.9 6 439l.8 132.6c0 3.2.5 6.4 1.5 9.4a31.95 31.95 0 0040.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-.5.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6 17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408zM323 735l-12-5-99 31-1-104-8-9c-84.6-103.2-90.2-251.9-11-361 96.4-132.2 281.2-161.4 413-66 132.2 96.1 161.5 280.6 66 412-80.1 109.9-223.5 150.5-348 102zm505-17l-8 10 1 104-98-33-12 5c-56 20.8-115.7 22.5-171 7l-.2-.1A367.31 367.31 0 00729 676c76.4-105.3 88.8-237.6 44.4-350.4l.6.4c23 16.5 44.1 37.1 62 62 72.6 99.6 68.5 235.2-8 330z"></path><path d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z">
                </path>
                </svg>
            </div>
        <div id="hercules_track" class="hercules_header_action_btn hercules-hover-el" data-hover-label="Stop/Start">
            <svg viewBox="64 64 896 896" id="pause" focusable="false" data-icon="pause"  width="24" height="24" style="filter: brightness(0.95);" fill="#828282" aria-hidden="true">
            <path d="M304 176h80v672h-80zm408 0h-64c-4.4 0-8 3.6-8 8v656c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V184c0-4.4-3.6-8-8-8z">
            </path>
            </svg>
            <svg viewBox="64 64 896 896" id="start" focusable="false" data-icon="start"  width="24" height="24" style="filter: brightness(0.95);display:none" fill="#828282" aria-hidden="true">
                <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path>
         </svg>
        </div>
        <div id="hercules_copy" class="hercules_header_action_btn hercules-hover-el" data-hover-label="Copy subtitles">
            <svg viewBox="64 64 896 896" focusable="false" 
            width="22" height="22"  style="filter: brightness(0.95);" fill="#828282" aria-hidden="true"
            >
            <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z">
            </path>
            </svg>
        </div>
            <div style="filter: brightness(0.9);" id="yt_ai_header_toggle" class="hercules_header_action_btn">
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2447 9.9588C16.5376 9.6659 16.5376 9.19103 16.2447 8.89814C15.9518 8.60524 15.4769 8.60524 15.184 8.89814L16.2447 
                    9.9588ZM6.81611 8.89814C6.52322 8.60524 6.04835 8.60524 5.75545 8.89814C5.46256 9.19103 5.46256 9.6659 5.75545 9.9588L6.81611 
                    8.89814ZM11.7425 14.461L16.2447 9.9588L15.184 8.89814L10.6819 13.4003L11.7425 14.461ZM11.3183 13.4003L6.81611 8.89814L5.75545 
                    9.9588L10.2576 14.461L11.3183 13.4003ZM10.6819 13.4003C10.8576 13.2246 11.1425 13.2246 11.3183 13.4003L10.2576 14.461C10.6677 
                    14.871 11.3325 14.871 11.7425 14.461L10.6819 13.4003Z" fill="#8B8B8B"/>
                </svg>
            </div>
        </div>
    </div>
    <div id="yt_ai_summary_body" class="yt_ai_summary_body">
        <div id="hercules_lang_select" class="hercules_lang_select"></div>
        <div id="hercules_text" class="hercules_text"></div>
    </div>
    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
</div>`;

export default main;
