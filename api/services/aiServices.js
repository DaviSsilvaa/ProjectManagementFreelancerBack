const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
  async generateProjectInsights(project, client, userData) { 
    try {
      const completion = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content: "Você é um Especialista em Segurança da Informação e Arquiteto de Software Sênior. Sua análise deve ser estritamente técnica e voltada para riscos de infraestrutura e conformidade."
    },
    {
      role: "user",
      content: `Analise o projeto: ${project.title}. 
      Orçamento: R$ ${project.budget}. 
      Cliente: ${client?.name}.
      
      FOCO DA ANÁLISE:
      1. Viabilidade técnica para o orçamento de R$ ${project.budget}.
      2. Riscos de segurança e integridade de dados (Cybersecurity).
      3. NÃO mencione o nível de experiência do desenvolvedor.
      
      Retorne APENAS um JSON: {
        "analise_cliente": "Análise técnica do perfil do cliente e histórico.",
        "viabilidade_financeira": "Como o orçamento impacta na escolha de servidores/segurança.",
        "alerta_margem_lucro": "Dica técnica sobre custos de APIs ou Nuvem.",
        "risco_prazo": "Riscos técnicos que podem atrasar a entrega."
      }`
    }
  ],
  model: "llama-3.3-70b-versatile", 
  response_format: { type: "json_object" }
});

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error("ERRO GROQ:", error.message);
      return {
        analise_cliente: "Análise estratégica em processamento.",
        viabilidade_financeira: "O orçamento de R$ " + project.budget + " está sendo validado.",
        alerta_margem_lucro: "Dica: Monitore custos operacionais.",
        risco_prazo: "Prazo adequado ao escopo."
      };
    }
  }
};