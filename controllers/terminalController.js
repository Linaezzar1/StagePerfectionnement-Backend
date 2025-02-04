const { exec } = require('child_process');

let currentDirectory = process.cwd();

// Liste des commandes autorisées
const allowedCommands = [
    'git status',
    'git add .',
    /^git commit -m ".*"$/,
    'git push origin main',
    'git init',
    /^cd .*/, // Autorise la navigation entre dossiers
    /^mkdir .*/, // Autorise la création de dossiers
    /^ls$/, // Liste les fichiers du répertoire
     /^git remote add .*/,
  ];

const executeCommand = (req, res) => {
  const { command } = req.body;

  if (!command || command.trim() === '') {
    return res.status(400).json({ error: 'Commande non fournie ou invalide' });
  }

  const isAllowed = allowedCommands.some((pattern) => {
    if (typeof pattern === 'string') return command === pattern;
    if (pattern instanceof RegExp) return pattern.test(command);
    return false;
  });

  if (!isAllowed) {
    return res.status(403).json({ error: 'Commande non autorisée' });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    return res.status(200).json({ output: stdout });
  });
};

module.exports = { executeCommand };
