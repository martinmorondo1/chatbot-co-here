/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from "react";


type Message = {
  id: string;
  type: 'bot' | 'user';
  text: React.ReactNode;
};

const ANSWERS = {
  spanishIntro: (
    <p>
     Mi nombre es Martín Morondo y actualmente estudio Ingeniería en Sistemas en la UNICEN. Soy un apasionado Desarrollador Front-end radicado en Argentina.
     Me encanta diseñar y crear sitios web responsivos o aplicaciones web desde cero. Las tecnologías, herramientas y lenguajes que utilizo para construir mis proyectos son HTML, CSS, Bootstrap, Tailwind, Javascript, Typecript, jQuery, React JS, , Git, GitHub y VS Code.
     Además, cuento con un nivel de inglés avanzado.
    </p>
  ),
  spanishContact: (
    <p>
      Si tienes alguna duda o necesitas resolver algo, puedes ponerte en contacto conmigo a través de mi correo electrónico: martinmorondo@gmail.com. 
      Además, ¡puedes preguntarme lo que necesites!
    </p>
  ),
  Trabajo: (
    <p>
      Actualmente no estoy trabajando y estoy escuchando propuestas laborales, ya que me encuentro buscando trabajo.
      Tengo todos los días libres, de lunes a viernes.
    </p>
  ),
  spanishRandom: (
    <ul>
     Estas son algunas de las preguntas que podes hacerme:
     <li>- ¿Quien sos?</li>
     <li>- ¿Por donde te puedo contactar?</li>
     <li>- ¿Con qué tecnologías tenes experiencia?</li>
     <li>- ¿Como es tu GitHub o Linkedin?</li>
    </ul>
  ),
  redes: (
    <p>
      Mis redes sociales son las siguientes:  <a 
      href = "https://www.linkedin.com/in/martin-morondo/" 
      target="_blank" 
      rel="noopener noreferrer" className="underline text-blue-400">Linkedin</a> y mi perfil de <a 
      href="https://github.com/martinmorondo
      " 
      target="_blank" 
      rel="noopener noreferrer" className="underline text-blue-400">GitHub.</a>
    </p>
  ),
}

const EXAMPLES = [{"text": "Hola", "label": "spanishIntro"}, {"text": "Cómo estás?", "label": "spanishIntro"}, {"text": "Quién sos?", "label": "spanishIntro"}, {"text": "Tengo una oferta para vos", "label": "Trabajo"}, {"text": "Por dónde te puedo contactar?", "label": "spanishContact"}, {"text": "Tengo una duda", "label": "spanishContact"}, {"text": "Necesito solucionar algo", "label": "spanishContact"}, {"text": "Estás buscando un cambio laboral?", "label": "Trabajo"}, {"text": "Con qué tecnologías trabajas?", "label": "spanishIntro"}, {"text": "Con qué tecnologías tenes experiencia?", "label": "spanishIntro"}, {"text": "Estás escuchando propuestas?", "label": "spanishContact"}, {"text": "Sabes inglés?", "label": "spanishIntro"}, {"text": "Cuántos años de experiencia tenes?", "label": "spanishIntro"}, {"text": "Te interesa cambiar de compañía?", "label": "Trabajo"},{"text": "Cómo es tu Linkedin?", "label": "redes"}, {"text": "Cómo es tu GitHub?", "label": "redes"}, {"text": "Te puedo hacer una consulta?", "label": "spanishContact"}, {"text": "Tenés currículum/CV?", "label": "spanishIntro"},  {"text": "Cuál es tu expectativa salarial?", "label": "Trabajo"}, {"text": "Dónde estás trabajando?", "label": "Trabajo"},  {"text": "Contame acerca de vos", "label": "spanishIntro"},{"text": "Que habilidades manejas?", "label": "spanishIntro"}, {"text": "Cuál es tu empleo actual?", "label": "Trabajo"}, {"text": "Dónde trabajas?", "label": "Trabajo"}, {"text": "Cuáles son tus redes?", "label": "redes"}, {"text": "Cómo hiciste este chat?", "label": "spanishRandom"}, {"text": "Dónde vivis actualmente?", "label": "spanishRandom"}, {"text": "Haces deportes?", "label": "spanishRandom"},{"text": "Qué horarios tenes libres?", "label": "Trabajo"}, {"text": "ayuda", "label": "spanishRandom"},]

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hola, soy un bot dispuesto a responder algunas preguntas sobre Martín Morondo. Hazme tu pregunta o escribe ayuda y te diré algunas preguntas que podes hacerme.",
    },
  ]);

  const [question, setQuestion] = useState<string>("");
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);
  const [isCollapsed, toggleCollapsed] = useState<boolean>(true);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if(isLoading) return;

    toggleLoading(true);
    setMessages((messages) => 
      messages.concat({id: String(Date.now()), type: "user", text: question}),
      );
    setQuestion("");

    const {classifications} = await fetch("https://api.cohere.ai/v1/classify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "large",
      inputs: [question],    
      examples: EXAMPLES,
    }),
  }).then(res => res.json());(

  setMessages((messages) =>
  messages.concat({
    id: String(Date.now()), 
    type: "bot", 
    text: ANSWERS[classifications[0].prediction as keyof typeof ANSWERS] || ANSWERS["spanishRandom"],
  }),
  ))
  toggleLoading(false); 
}

  useEffect(() => {
    container.current?.scrollTo(0, container.current.scrollHeight);
  }, [messages]);

  return (
    <div className="main-container min-h-screen flex flex-col justify-center items-center p-4">
    <h1 className="main-text font-bold rounded border border-red-100 p-4">Chatbot</h1>
    <main className="p-4">
      <div className="fixed bottom-3 right-2">
        {isCollapsed ? (
          <button className="bg-blue-500 text-white p-2 rounded-tl-lg" onClick={() => toggleCollapsed(false)}>
            Abrir chat
          </button>
        ) : (
      <div className="relative">
        <button className="text-xl rounded-full bg-red-600 w-8 h-8 absolute -left-4 -top-3" onClick={() => toggleCollapsed(true)}>×</button>
        <div className = 'flex-container flex flex-col gap-4 m-auto max-w-lg border border-white-400 p-4 rounded-md'>
        <div ref = {container} className="container flex flex-col gap-4 h-[300px] overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`message-id p-4 max-w-[80%] rounded-3xl text-white ${message.type === 'bot' 
          ? 'bot bg-slate-500 text-left self-start rounded-bl-none' 
          : 'user bg-blue-500 text-right self-end rounded-br-none'}`}>{message.text}</div>
           ))}
        </div>
        <form className="form flex items-center" onSubmit={handleSubmit}>
          <input 
            placeholder="¿Who are you?" className="input rounded rounded-r-none flex-1 border border-gray-400 py-2 px-4" 
            name="question"
            type="text" 
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            />
          <button 
          disabled={isLoading}
          type="submit" 
          className={`loading-btn px-4 py-2 bg-blue-500 rounded-lg rounded-l-none
          ${isLoading ? 'bg-blue-300': 'bg-blue-500'}`}
          >↩</button>
        </form>
        </div>
      </div> 
      )}
      </div> 
    </main> 
    </div>
  );
}

export default Chat;

