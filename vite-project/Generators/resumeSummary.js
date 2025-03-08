export const getRandomSummary = () => {
const defaultSummaries = [
    "Dedicated and highly motivated professional with a passion for achieving excellence in every task. Strong analytical skills and a proactive approach to problem-solving.",
    "Innovative thinker with a track record of delivering results. Experienced in working in fast-paced environments and collaborating effectively with diverse teams.",
    "Self-motivated and goal-oriented individual with a keen eye for detail. Enthusiastic about continuous learning and professional development.",
    "Proactive and adaptable professional, committed to delivering high-quality work and exceeding expectations. Strong communication and leadership skills.",
    "Versatile and results-driven professional, eager to contribute expertise in a challenging and rewarding role. Passionate about driving efficiency and innovation."
  ];
  
    return defaultSummaries[Math.floor(Math.random() * defaultSummaries.length)];
  };
  
