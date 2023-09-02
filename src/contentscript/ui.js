export const ui = `
<div class="yt_ai_summary_container">
    <div id="yt_ai_summary_header" class="yt_ai_summary_header">
        <a href="#" target="_blank" style="width: 24px;height: 24px;">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48.000000 48.000000" preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#ff0000" stroke="none">
        <path d="M212 448 c-26 -16 -31 -17 -26 -4 9 23 -2 20 -57 -14 -68 -41 -90  -65 -75 -80 8 -9 4 -17 -19 -36 -17 -14 -22 -22 -12 -18 9 3 17 1 17 -5 0 -6 -4 -11 -10 -11 -5 0 -10 -8 -10 -18 0 -10 -5 -23 -11 -29 -9 -9 -7 -10 10 -6 27 7 27 -10 -1 -38 l-23 -23 28 18 c41 25 57 14 19 -13 -34 -24 -45 -49 -14 -32 12 6 23 5 37 -5 20 -15 20 -15 -5 -35 -24 -20 -24 -20 -2 -9 30 15 42 4 16 -15 -18 -13 -18 -14 3 -8 14 3 23 1 23 -6 0 -8 9 -7 28 3 23 12 30 12 47 0 18 -13 18 -15 1 -27 -16 -12 -13 -13 23 -11 23 1 45 4 48 8 3 3 11 2 17 -3 15 -12 117 46 123 69 3 10 16 23 29 30 27 15 32 40 9 40 -21 0 -19 18 4 32 10 6 17 17 14 24 -2 7 5 19 16 26 28 17 29 43 2 28 -13 -7 -22 -7 -26 0 -3 6 0 13 9 16 8 3 14 14 13 25 -1 22 -2 22 -28 9 -20 -11 -26 -1 -9 16 7 7 1 9 -20 6 -37 -5 -39 10 -5 28 15 8 22 17 16 23 -5 5 -19 2 -35 -8 -15 -10 -30 -14 -34 -11 -7 7 4 17 45 42 15 10 14 11 -10 7 -17 -4 -34 0 -45 10 -16 15 -20 15 -47 -3 -17 -11 -33 -20 -37 -20 -13 0 -9 38 5 43 6 3 8 5 2 5 -5 0 -25 -9 -43 -20z m106 -150 c7 -7 12 -33 12 -58 0 -25 -5 -51 -12 -58 -16 -16 -150 -16 -166 0 -19 19 -15 105 6 117 24 15 145 14 160 -1z"/>
        <path d="M220 240 c0 -18 3 -19 21 -9 17 9 19 13 8 20 -22 14 -29 11 -29 -11z"/>
        <path d="M29 113 c-13 -15 -12 -15 9 -4 23 12 28 21 13 21 -5 0 -15 -7 -22 -17z"/>
        </g>
        
        </svg>
        
        </a>
        <p class="yt_ai_summary_header_text">YouTube AI Translator</p>
        <div class="yt_ai_summary_header_actions">
            <div style="filter: brightness(0.9);" id="yt_ai_summary_header_toggle" class="yt_ai_summary_header_action_btn">
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
        <div id="yt_ai_summary_lang_select" class="yt_ai_summary_lang_select"></div>
        <div id="yt_ai_summary_text" class="yt_ai_summary_text"></div>
    </div>
</div>`

export const loading = `<svg class="yt_ai_summary_loading"
 style="display: block;width: 48px;margin: 40px auto;" 
 width="48" height="48" viewBox="0 0 200 200" fill="none" 
 xmlns="http://www.w3.org/2000/svg">
    <path d="M100 36C59.9995 36 37 66 37 99C37 132 61.9995 163.5 100 163.5C138 163.5 164 132 164 99" stroke="#5C94FF" stroke-width="6"/>
</svg>`