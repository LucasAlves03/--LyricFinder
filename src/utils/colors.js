export const getMusicGradient = () => {
  const gradients = [
    ['#667eea', '#764ba2'], 
    ['#f093fb', '#f5576c'], 
    ['#4facfe', '#00f2fe'], 
    ['#43e97b', '#38f9d7'], 
    ['#fa709a', '#fee140'], 
    ['#30cfd0', '#330867'], 
    ['#a8edea', '#fed6e3'], 
    ['#ff9a9e', '#fecfef'], 
    ['#ffecd2', '#fcb69f'], 
    ['#ff6e7f', '#bfe9ff'], 
    ['#e0c3fc', '#8ec5fc'], 
    ['#fbc2eb', '#a6c1ee'], 
  ];

  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const getGradientColors = getMusicGradient;