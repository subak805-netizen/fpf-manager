/* 도식화 탭 「클로드가 그린 부품」 (2026-10-19)
   사용자가 사진을 주며 「이거 도식화로 그려줘」 하면 클로드가 여기에 한 줄씩 더함 → 부품 서랍에 바로 뜸.
   규칙: k=고유 이름(영문), nm=서랍에 보일 이름(6자 안), w·h=크기(종이 3300 기준 px), svg=가운데(0,0) 기준 선 그림.
   선은 #231f20, 외곽 2.4~2.6 / 안쪽 1.2~1.6, 점선 스티치는 stroke-dasharray. 이모지 금지. */
window.DK2_EXTRA_PARTS = [
  /* 2026-10-20 아루드 카고 조거(아루드 도식화3 7번 대지 사진): 밑단 스트링·스토퍼·고정 테잎, 속스트링 철팁, 속나나 */
  {k:'stopper_barrel',nm:'원통 스토퍼',w:52,h:48,svg:'<line x1="-25" y1="5" x2="25" y2="5" stroke="#231f20" stroke-width="3" stroke-linecap="round"/><rect x="-8" y="-22" width="16" height="9" rx="3" fill="#fff" stroke="#231f20" stroke-width="2"/><rect x="-13" y="-15" width="26" height="33" rx="7" fill="#fff" stroke="#231f20" stroke-width="2.4"/><line x1="-13" y1="-6" x2="13" y2="-6" stroke="#231f20" stroke-width="1.2"/><ellipse cx="0" cy="5" rx="4.5" ry="3.4" fill="#231f20"/>'},
  {k:'hem_cord',nm:'밑단 스트링',w:56,h:96,svg:'<path d="M-5 -42 C-8 -10 -22 20 -14 36 C-8 46 8 46 14 36 C22 20 8 -10 5 -42" fill="none" stroke="#231f20" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="-43" rx="9" ry="3.6" fill="#fff" stroke="#231f20" stroke-width="1.6"/><rect x="-7" y="-27" width="14" height="7" rx="2.5" fill="#fff" stroke="#231f20" stroke-width="1.8"/><rect x="-12" y="-21" width="24" height="24" rx="6" fill="#fff" stroke="#231f20" stroke-width="2.4"/><line x1="-12" y1="-13" x2="12" y2="-13" stroke="#231f20" stroke-width="1.2"/>'},
  {k:'fix_tape',nm:'고정 테잎',w:34,h:58,svg:'<rect x="-14" y="-27" width="28" height="54" fill="#fff" stroke="#231f20" stroke-width="2.2"/><rect x="-9" y="-22" width="18" height="44" fill="none" stroke="#231f20" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="-14" y1="0" x2="14" y2="0" stroke="#231f20" stroke-width="1"/>'},
  {k:'cord_tip',nm:'스트링 철팁',w:20,h:74,svg:'<path d="M-4 -36 V13 H4 V-36" fill="#fff" stroke="#231f20" stroke-width="2"/><rect x="-5.5" y="12" width="11" height="23" rx="2" fill="#d9d9d9" stroke="#231f20" stroke-width="2.2"/><line x1="-5.5" y1="17" x2="5.5" y2="17" stroke="#231f20" stroke-width="1.2"/><line x1="-5.5" y1="30" x2="5.5" y2="30" stroke="#231f20" stroke-width="1.2"/>'},
  {k:'nana',nm:'나나 구멍',w:16,h:36,svg:'<rect x="-6" y="-16" width="12" height="32" rx="6" fill="#fff" stroke="#231f20" stroke-width="2"/><line x1="0" y1="-10" x2="0" y2="10" stroke="#231f20" stroke-width="1.4"/>'}
];
