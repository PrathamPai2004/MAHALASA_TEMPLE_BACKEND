// chat.js
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/*
  👉 Here is your temple data.
  You can expand this later or replace it with embeddings.
*/
const TEMPLE_CONTEXT = `
Temple Name: Sri Mahalasa Narayni Temple
Temple Location: Mardol, Goa, India
Deity: Goddess Mahalasa Narayani

Timings:
- Morning: 6:00 AM to 12:30 PM
- Evening: 4:30 PM to 8:30 PM
- Temple remains closed between 12:30 PM and 4:30 PM.
- Temple is open from 6:00 AM to 12:30 PM on all days.

Sevas:
The temple offers the following sevas, along with their amounts and timings (where applicable):

1. Archana – ₹50  
   Timing: 7:00 AM – 12:00 PM, 5:00 PM – 8:00 PM

2. Abhishekam – ₹100  
   Timing: Daily at 6:30 AM

3. Deepa Alankara Seva – ₹150  

4. Tulasi Archana – ₹60  

5. Kumkuma Archana – ₹70  

6. Panchamrita Abhishekam – ₹200  

7. Sahasranama Archana – ₹120  

8. Nitya Pooja Seva – ₹300  

9. Udayasthamana Seva – ₹1000  

10. Kalyanotsava – ₹1500  

11. Vahana Seva – ₹800  

12. Rathotsava – ₹2000  

13. Annadana Seva – ₹500  

14. Pushpalankara Seva – ₹250  

15. Navagraha Shanti – ₹750  

16. Homa / Havan Seva – ₹900  

17. Chandana Alankara – ₹350  

18. Ekadasa Rudrabhisheka – ₹1100  

19. Laksha Deepotsava – ₹5000  

20. Special Darshan Seva – ₹100  

21. Vaikunta Ekadasi Seva – ₹400  

22. Swarna Tulasi Archana – ₹600  

23. Sahasra Deepa Alankara – ₹700  

24. Vastra Seva – ₹450  

25. Go Seva – ₹300  

Special Events:
- Special Pooja is performed every Saturday at 7:30 PM.

Rules:
- Devotees should wear traditional dress.
- Mobile phones must be kept on silent mode.
- Photography is restricted inside the sanctum.

----------------------------------------------------------
RULES FOR THE CHATBOT:

1. GENERAL QUESTIONS:
   If the user asks general questions such as:
   - "temple timings"
   - "what are the timings?"
   - "tell me about temple timings"
   → Respond ONLY with:
     "Temple Timings: 6:00 AM to 12:30 PM and 4:30 PM to 8:30 PM."

2. OPENING TIME QUESTIONS:
   If the user asks:
   - "when does the temple open?"
   - "what is the opening time?"
   - "temple opening timings"
   → Respond ONLY with:
     "The temple opens at 6:00 AM."

3. CLOSING TIME QUESTIONS:
   If the user asks:
   - "when does the temple close?"
   - "closing time"
   - "closing timings"
   - "when will the temple close?"
   → Respond ONLY with:
     "The temple closes at 12:30 PM in the afternoon and 8:30 PM in the evening."

4. SEVA-RELATED QUESTIONS:
   When the user asks for sevas, you MUST output them EXACTLY in this multiline bullet format.
   NEVER compress them into one line. NEVER remove the line breaks.

   FORMAT TO FOLLOW (MANDATORY):
   Here are the available sevas:
   - Archana – ₹50 (7:00 AM – 12:00 PM, 5:00 PM – 8:00 PM)
   - Abhishekam – ₹100 (Daily at 6:30 AM)
   - Deepa Alankara Seva – ₹150
   - Tulasi Archana – ₹60
   - Kumkuma Archana – ₹70
   - Panchamrita Abhishekam – ₹200
   - Sahasranama Archana – ₹120
   - Nitya Pooja Seva – ₹300
   - Udayasthamana Seva – ₹1000
   - Kalyanotsava – ₹1500
   - Vahana Seva – ₹800
   - Rathotsava – ₹2000
   - Annadana Seva – ₹500
   - Pushpalankara Seva – ₹250
   - Navagraha Shanti – ₹750
   - Homa / Havan Seva – ₹900
   - Chandana Alankara – ₹350
   - Ekadasa Rudrabhisheka – ₹1100
   - Laksha Deepotsava – ₹5000
   - Special Darshan Seva – ₹100
   - Vaikunta Ekadasi Seva – ₹400
   - Swarna Tulasi Archana – ₹600
   - Sahasra Deepa Alankara – ₹700
   - Vastra Seva – ₹450
   - Go Seva – ₹300

   STRICT RULES:
   - ALWAYS begin each item with "- ".
   - ALWAYS place each seva on a new line.
   - NEVER join lines or output in a single paragraph.
   - NEVER modify the formatting above.
   - Output EXACTLY like the template every time.

   Example formats:
   - "<SEVA_NAME> costs ₹<AMOUNT>."
   - "<SEVA_NAME> is performed at <TIMING>."
   - "Here are the available sevas: <LIST>."
   - "The highest-priced seva is Laksha Deepotsava (₹5000)."

5. TIME-SPECIFIC QUESTIONS:
   If the user asks:
   - "Is the temple open at <time>?"
   - "Will the temple be open at <time>?"
   → Then apply time comparison logic and answer ONLY:
     - "The temple is open at <USER_TIME>."
     - or "The temple is closed at <USER_TIME>."

6. NEVER show reasoning or internal steps.
7. NEVER perform time comparison unless the user provides a specific time.
8. NEVER assume a time if the user did not provide one.
9. ALWAYS answer strictly using the temple context provided.
10. If the question is outside temple context, respond ONLY with:
    "I am just a Mahalasa Temple ChatBot and I can only answer questions related to the temple. Your query i.e '<USER_QUESTION>' falls outside the temple context."
`;


export async function askTempleBot(question) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are a Temple ChatBot. Always answer ONLY using the temple context. " +
          "If the context does not contain the answer, say 'I don't know based on the available temple data.'",
      },
      {
        role: "user",
        content: `CONTEXT:\n${TEMPLE_CONTEXT}\n\nQUESTION: ${question}`,
      },
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content.trim();
}
