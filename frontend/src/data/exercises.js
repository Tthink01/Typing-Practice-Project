// src/data/exercises.js

export const EXERCISES_DATA = {
  basic: {
    TH: [
      {
        id: 1, title: "ด่านที่ 1", sub: "แป้นเหย้า",
        content: "กา ดา หา สา วา ฟา งา ก่า ด่า ว่า ส่า ห่า ฟ่า ก้า ด้า ว้า ฟ้า ห้า ส้า ง้า กด หก สด ดก งก วง ดง กาง วาง สาง หาง ฟาง งาง กาด วาด สาด หาด ฟาด งาด กาก สาก ฟาก ดาก งาก กาว วาว สาว หาว ฟาว งาว เก เด เส เห เฟ"
      },
      {
        id: 2, title: "ด่านที่ 2", sub: "แถวบน",
        content: "รบ บน ลบ พบ นบ ยบ ไร ไย ไพ ไล รำ ยำ นำ บำ ลำ ระ ละ พะ ยะ นะ บะ รับ นับ ลับ พับ ยับ รัย รัน ยัน บัน ลัน พัน พี รี ยี นี บี ลี นัย ลัย ระยับ"
      },
      {
        id: 3, title: "ด่านที่ 3", sub: "แถวล่าง",
        content: "ออ แอ มอ แม ทอ แท ปอ แป ผอ แผ ฝอ แฝ ออม แอม มอม แมม ทอม แทม ปอม แปม ผอม มือ ทือ อือ ใฝ ทิม ปิม อิม ทิ มิ ปิ ผิ มอมแมม ปอมปอม"
      },
      {
        id: 4, title: "ด่านที่ 4", sub: "แถวเลข",
        content: "จุ คุ ตุ ถุ ภุ ขุ ชุ จึ คึ ตึ ถึ ภึ ขึ ชึ จุจึ คุคึ ตุตึ ถุถึ คต ภถ /- 123 456 789 007 2024"
      },
      {
        id: 5, title: "ด่านที่ 5", sub: "รวมทุกแถว",
        content: "เวลา ราคา นาที ดีใจ ไปมา หามี กาแฟ ดูดี มีตา หูดี ปูนา ทายา มานี ปีใหม่ ใจดี สีเทา เรามา ทำไม ใคร ไหน ไทย โรงเรียน หนังสือ ความรัก ทำงาน วันนี้ พรุ่งนี้ สบาย สนุก อร่อย ขอบคุณ ขอโทษ สวัสดี เด็ก เล็ก เป็ด เกี๊ยว ก๋วยเตี๋ยว กระเป๋า น้ำแข็ง รวดเร็ว สำเร็จ แข็งแรง ตั๊กแตน ตุ๊กตา โจ๊ก กิ๊บ โชคดี ณ ธนาคาร ไปรษณีย์ ศิลปะ เศรษฐกิจ กฎหมาย ปฏิรูป วัฒนธรรม ฎีกา ฤดู ศึกษา พัฒนา เจริญ"
      }
    ],
    EN: [
      {
        id: 1, title: "Level 1", sub: "Home Row",
        content: "as da fa ja ka la sad dad lad fad jak ask all fall lass flask add salad flash slash half hall has had gas glass dash ash hash saga gala flag lag"
      },
      {
        id: 2, title: "Level 2", sub: "Top Row",
        content: "pot top rot to it pit tip quit row tow pow out put route write type true tree root tour pour quiet power tower wire tire you we our were port report toy try wet yet pet popper pepper proper upper outer"
      },
      {
        id: 3, title: "Level 3", sub: "Bottom Row",
        content: "zxc vbn mnb cvb zxcv bnm zz xx cc vv bb nn mm b.n m,n z/x c.v b,m x.z v/c"
      },
      {
        id: 4, title: "Level 4", sub: "Numbered Row",
        content: "123 456 789 012 345 678 909 101 202 1990 2025 11 22 33 44 55 66 77 88 99 00 1-2 3-4 5=5 10-1 100 50-50"
      },
      {
        id: 5, title: "Level 5", sub: "All Rows",
        content: "The And For Are But Not You All Any Can Her Was One Day Get Has Him His How Man New Now Time Year Way Thing Life World School State Family Student Group Country Problem Hello World Python React Thailand Bangkok Mr. Smith I am English Computer JavaScript Coding Typing Master Speed Accuracy Google Facebook Data"
      }
    ]
  },
  
  // ✅ Pro Level: แยกเป็นประโยคเดี่ยวๆ (Single Sentence)
  pro: {
    TH: [
      {
        id: 1, title: "ด่านที่ 1", sub: "ประโยคทั่วไป",
        content: [
          "การเดินทางท่องเที่ยวในวันหยุดสุดสัปดาห์ช่วยผ่อนคลายความเครียดจากการทำงานได้เป็นอย่างดี",
          "วันนี้ท้องฟ้าแจ่มใสมาก เหมาะแก่การออกไปเดินเล่นสูดอากาศบริสุทธิ์ในสวนสาธารณะ",
          "อาหารเช้าเป็นมื้อที่สำคัญที่สุดของวัน เพราะช่วยเติมพลังงานให้สมองและร่างกายพร้อมลุยงาน",
          "การอ่านหนังสือวันละนิดช่วยเปิดโลกทัศน์และสร้างแรงบันดาลใจใหม่ๆ ให้กับชีวิตของเราเสมอ",
          "ฉันชอบกลิ่นหอมของกาแฟคั่วบดในตอนเช้า มันทำให้รู้สึกกระปรี้กระเปร่าและตื่นตัว",
          "ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น เป็นคำสอนที่ยังคงใช้ได้จริงในทุกยุคทุกสมัย",
          "การออกกำลังกายอย่างสม่ำเสมอไม่เพียงแต่ทำให้ร่างกายแข็งแรง แต่ยังช่วยให้จิตใจแจ่มใสด้วย",
          "รอยยิ้มที่จริงใจสามารถสร้างมิตรภาพและความประทับใจแรกพบให้กับผู้คนรอบข้างได้เสมอ",
          "การเรียนรู้ภาษาใหม่ๆ เป็นการเปิดประตูสู่โอกาสและวัฒนธรรมที่แตกต่างหลากหลายทั่วโลก",
          "ธรรมชาติที่สวยงามรอบตัวเรา คือของขวัญล้ำค่าที่ควรรักษาไว้ให้ลูกหลานในอนาคต"
        ]
      },
      {
        id: 2, title: "ด่านที่ 2", sub: "บทความกึ่งทางการ",
        content: [
          "ท่ามกลางกระแสโลกาภิวัตน์ที่เปลี่ยนแปลงอย่างรวดเร็ว การปรับตัวและเรียนรู้สิ่งใหม่เป็นกุญแจสำคัญสู่ความอยู่รอด",
          "สถาปัตยกรรมไทยในสมัยอยุธยามีความวิจิตรบรรจง สะท้อนให้เห็นถึงความรุ่งเรืองทางศิลปวัฒนธรรมในอดีตกาล",
          "ปัญหาสิ่งแวดล้อมเป็นวาระเร่งด่วนที่ประชาคมโลกต้องร่วมมือกันแก้ไขอย่างจริงจังเพื่ออนาคตที่ยั่งยืน",
          "ความกตัญญูกตเวทีต่อผู้มีพระคุณเป็นคุณธรรมอันประเสริฐที่ช่วยค้ำจุนสังคมให้มีความสงบสุขและร่มเย็น",
          "การอนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อมไม่ได้เป็นเพียงหน้าที่ของภาครัฐ แต่เป็นความรับผิดชอบของทุกคน",
          "เทคโนโลยีปัญญาประดิษฐ์กำลังเข้ามามีบทบาทสำคัญในการขับเคลื่อนเศรษฐกิจและอุตสาหกรรมในยุคดิจิทัล",
          "ความสามัคคีปรองดองของคนในชาติเปรียบเสมือนเกราะป้องกันภัยอันตรายทั้งปวงที่จะมากล้ำกราย",
          "การดำเนินชีวิตตามหลักปรัชญาเศรษฐกิจพอเพียงสอนให้เรารู้จักความพอประมาณและมีภูมิคุ้มกันที่ดี",
          "นวัตกรรมทางการแพทย์สมัยใหม่ช่วยยกระดับคุณภาพชีวิตและเพิ่มโอกาสในการรักษาโรคที่ซับซ้อนให้หายขาด",
          "การสื่อสารที่มีประสิทธิภาพต้องอาศัยทั้งทักษะการพูดและการฟังอย่างตั้งใจเพื่อให้เกิดความเข้าใจที่ตรงกัน"
        ]
      },
      {
        id: 3, title: "ด่านที่ 3", sub: "ภาษาชั้นสูง/วิชาการ",
        content: [
          "แม้นมาตรว่าอุปสรรคขวากหนามจะมากมายเพียงใด หากจิตใจยังคงมุ่งมั่นและศรัทธาในความดี ความสำเร็จย่อมอยู่ไม่ไกลเกินเอื้อม",
          "วิกฤตการณ์ทางเศรษฐกิจที่เกิดขึ้นส่งผลกระทบในวงกว้างต่อเสถียรภาพทางการเงินและการลงทุนของภาคเอกชนอย่างหลีกเลี่ยงไม่ได้",
          "การปฏิรูปการศึกษาต้องมุ่งเน้นการพัฒนาทักษะการคิดวิเคราะห์และการแก้ปัญหาอย่างสร้างสรรค์ มากกว่าการท่องจำตำราเพียงอย่างเดียว",
          "สุนทรียภาพแห่งธรรมชาติที่รายล้อมรอบกาย ช่วยจรรโลงจิตใจให้สงบและเกิดสมาธิ ท่ามกลางความวุ่นวายของโลกวัตถุนิยม",
          "ประวัติศาสตร์ได้จารึกวีรกรรมอันกล้าหาญของบรรพชนผู้เสียสละเลือดเนื้อเพื่อปกป้องเอกราชและอธิปไตยของชาติบ้านเมือง",
          "อันที่จริงแล้ว ความยุติธรรมนั้นไซร้ เป็นรากฐานสำคัญแห่งความสงบสุขของบ้านเมือง หากแม้นขาดซึ่งความเที่ยงธรรมแล้วไซร้ สังคมย่อมเกิดความโกลาหล",
          "วรรณคดีไทยเรื่องรามเกียรติ์ สะท้อนให้เห็นถึงคติธรรมและความเชื่อเรื่องบุญกรรมที่ฝังรากลึกในสังคมไทยมาช้านานผ่านตัวละครต่างๆ",
          "กระบวนการสังเคราะห์ด้วยแสงของพืชเปลี่ยนพลังงานแสงอาทิตย์เป็นพลังงานเคมีในรูปแบบของน้ำตาลและปล่อยออกซิเจนออกมาสู่บรรยากาศ",
          "ความเหลื่อมล้ำทางสังคมเป็นปัญหาเชิงโครงสร้างที่หยั่งรากลึก และต้องอาศัยนโยบายสาธารณะที่ครอบคลุมและเป็นธรรมในการแก้ไข",
          "ศิลปะการประนีประนอมมิใช่การยอมจำนนต่อความอธรรม แต่เป็นการแสวงหาจุดร่วมที่ลงตัวเพื่อยุติความขัดแย้งและนำมาซึ่งสันติภาพที่ยั่งยืน"
        ]
      }
    ],
    EN: [
      {
        id: 1, title: "Level 1", sub: "Conversational",
        content: [
          "Traveling to new places opens our eyes to different cultures and ways of life that we never knew existed.",
          "Reading a good book is like taking a journey through time and space without ever leaving your comfortable chair.",
          "The sound of rain tapping against the windowpane creates a soothing rhythm that helps me fall asleep.",
          "Consistency is the key to mastering any new skill, whether it is learning a language or playing an instrument.",
          "Spending quality time with family and friends is one of the most precious gifts we can give to ourselves.",
          "A positive attitude can transform a difficult situation into an opportunity for growth and learning.",
          "Music has the power to heal the soul and bring people together from all walks of life.",
          "Always remember to be kind to others, for everyone is fighting a battle you know nothing about.",
          "The early morning sun cast a golden glow over the sleepy village as the birds began to sing.",
          "Believe in yourself and your ability to achieve your dreams, no matter how impossible they may seem."
        ]
      },
      {
        id: 2, title: "Level 2", sub: "Professional",
        content: [
          "The rapid advancement of technology has fundamentally transformed the way we communicate, work, and interact with the world around us.",
          "Sustainable development requires a delicate balance between economic growth, environmental protection, and social equity for all citizens.",
          "Critical thinking involves analyzing information objectively and evaluating different perspectives before forming a well-reasoned conclusion.",
          "The intricate ecosystem of the rainforest is a testament to the remarkable biodiversity and interdependence of living organisms.",
          "Effective leadership is not just about giving orders, but about inspiring and empowering others to achieve their full potential.",
          "Climate change poses a significant threat to global food security and requires immediate international cooperation.",
          "The architectural design of the museum seamlessly blends modern aesthetics with traditional elements of the local culture.",
          "Financial literacy is an essential life skill that enables individuals to make informed decisions about their money.",
          "Globalization has created a deeply interconnected world where events in one country can have ripple effects across the globe.",
          "Scientific research plays a crucial role in expanding our knowledge and finding solutions to the complex challenges facing humanity."
        ]
      },
      {
        id: 3, title: "Level 3", sub: "Academic/Literary",
        content: [
          "In the grand tapestry of human history, every individual thread contributes to the intricate pattern of our collective civilization and heritage.",
          "The philosophical implications of artificial intelligence challenge our fundamental understanding of consciousness, ethics, and the essence of humanity itself.",
          "Amidst the cacophony of modern existence, finding moments of solitude and introspection becomes increasingly vital for maintaining mental equilibrium.",
          "The juxtaposition of ancient traditions and modern innovations creates a unique cultural landscape that is both nostalgic and forward-looking.",
          "Metaphorically speaking, life is a labyrinth of choices where every turn leads to unforeseen consequences and opportunities for growth.",
          "The concept of quantum entanglement suggests that particles can remain connected across vast distances, defying classical laws of physics.",
          "Literature serves as a mirror to society, reflecting its virtues and vices while inviting readers to question the status quo.",
          "The relentless pursuit of perfection can often become a paralyzing force that hinders creativity and stifles genuine innovation.",
          "Economic inequality is not merely a statistical anomaly but a profound social injustice that undermines the very fabric of democracy.",
          "To comprehend the vastness of the universe is to embrace a sense of humility and wonder at the sheer scale of cosmic existence."
        ]
      }
    ]
  }
};