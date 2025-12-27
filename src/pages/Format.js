import React, { useState, useEffect } from 'react';
import { translations, themeVariables } from './constants';
import './style.css';

function Format() {

  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [sqlInput, setSqlInput] = useState('');
  const [sqlOutput, setSqlOutput] = useState('');
  const [yamlInput, setYamlInput] = useState('');
  const [yamlOutput, setYamlOutput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('json');
  
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('ru');
  const [t, setT] = useState(translations.ru);


  useEffect(() => {
  
    const savedTheme = localStorage.getItem('format-theme') || 'light';
    const savedLanguage = localStorage.getItem('format-language') || 'ru';
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setT(translations[savedLanguage]);
    

    applyTheme(savedTheme);
  }, []);

 
  useEffect(() => {
    setT(translations[language]);
    localStorage.setItem('format-language', language);
  }, [language]);


  useEffect(() => {
    localStorage.setItem('format-theme', theme);
    applyTheme(theme);
  }, [theme]);


  const applyTheme = (themeName) => {
    const variables = themeVariables[themeName];
    const root = document.documentElement;
    
    Object.keys(themeVariables.light).forEach(key => {
      root.style.removeProperty(key);
    });
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    

    document.body.className = themeName === 'dark' ? 'dark-theme' : 'light-theme';
    document.body.style.backgroundColor = themeName === 'dark' ? '#0f172a' : '#f8fafc';
    document.body.style.color = themeName === 'dark' ? '#f1f5f9' : '#1e293b';
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setJsonOutput(`${t.error}: ${error.message}`);
    }
  };

  const formatSql = () => {
    try {
      let formatted = sqlInput
        .replace(/\bSELECT\b/gi, '\nSELECT\n  ')
        .replace(/\bFROM\b/gi, '\nFROM\n  ')
        .replace(/\bWHERE\b/gi, '\nWHERE\n  ')
        .replace(/\bJOIN\b/gi, '\nJOIN\n  ')
        .replace(/\bGROUP BY\b/gi, '\nGROUP BY\n  ')
        .replace(/\bORDER BY\b/gi, '\nORDER BY\n  ')
        .replace(/,\s*/g, ',\n  ');
      setSqlOutput(formatted.trim());
    } catch (error) {
      setSqlOutput(`${t.error}: ${error.message}`);
    }
  };

  const formatYaml = () => {
    try {
      const lines = yamlInput.split('\n').map(line => {
        if (line.includes(':') && !line.trim().startsWith('#')) {
          const parts = line.split(':');
          if (parts.length > 1) {
            return `${parts[0].trim()}: ${parts.slice(1).join(':').trim()}`;
          }
        }
        return line;
      });
      setYamlOutput(lines.join('\n'));
    } catch (error) {
      setYamlOutput(`${t.error}: ${error.message}`);
    }
  };

  const formatCode = () => {
    try {
      let formatted = codeInput;
      formatted = formatted.replace(/^\s+/gm, '');
      const lines = formatted.split('\n');
      let indent = 0;
      const result = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.endsWith('}') || trimmed.endsWith(')') || trimmed.endsWith(']')) {
          indent = Math.max(0, indent - 2);
        }
        
        result.push(' '.repeat(indent) + trimmed);
        
        if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
          indent += 2;
        }
      }
      
      setCodeOutput(result.join('\n'));
    } catch (error) {
      setCodeOutput(`${t.error}: ${error.message}`);
    }
  };


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(t.copySuccess))
      .catch(err => alert(t.copyError + err));
  };


  const clearFields = (type) => {
    switch(type) {
      case 'json':
        setJsonInput('');
        setJsonOutput('');
        break;
      case 'sql':
        setSqlInput('');
        setSqlOutput('');
        break;
      case 'yaml':
        setYamlInput('');
        setYamlOutput('');
        break;
      case 'code':
        setCodeInput('');
        setCodeOutput('');
        break;
      default:
        break;
    }
  };


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };


  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="format-container format-theme-transition">
      <header className="format-header">
        <div className="format-header-top">
          <div className="format-controls">
            <button className="format-theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'} {t.theme}
            </button>
            <button className="format-language-toggle" onClick={toggleLanguage}>
              {language === 'ru' ? '🇷🇺' : '🇺🇸'} {t.language}
            </button>
          </div>
        </div>
        
        <div className="format-header-content">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <div className="format-tabs">
        <button 
          className={activeTab === 'json' ? 'active' : ''} 
          onClick={() => setActiveTab('json')}
        >
          {t.json}
        </button>
        <button 
          className={activeTab === 'sql' ? 'active' : ''} 
          onClick={() => setActiveTab('sql')}
        >
          {t.sql}
        </button>
        <button 
          className={activeTab === 'yaml' ? 'active' : ''} 
          onClick={() => setActiveTab('yaml')}
        >
          {t.yaml}
        </button>
        <button 
          className={activeTab === 'code' ? 'active' : ''} 
          onClick={() => setActiveTab('code')}
        >
          {t.code}
        </button>
      </div>

      <main className="format-main-container">
        {activeTab === 'json' && (
          <div className="format-block">
            <h2>{t.jsonTitle}</h2>
            <div className="format-editor-container">
              <div className="format-input-section">
                <h3>{t.input}</h3>
                <textarea
                  className="format-textarea"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={t.placeholders.json}
                  rows={10}
                />
                <div className="format-buttons">
                  <button onClick={() => clearFields('json')}>{t.clear}</button>
                  <button onClick={formatJson} className="format-format-btn">{t.format}</button>
                </div>
              </div>
              
              <div className="format-output-section">
                <h3>{t.output}</h3>
                <textarea
                  className="format-textarea"
                  value={jsonOutput}
                  readOnly
                  rows={10}
                />
                <div className="format-buttons">
                  <button 
                    onClick={() => copyToClipboard(jsonOutput)} 
                    disabled={!jsonOutput}
                    className="format-copy-btn"
                  >
                    {t.copy}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      
        {activeTab === 'sql' && (
          <div className="format-block">
            <h2>{t.sqlTitle}</h2>
            <div className="format-editor-container">
              <div className="format-input-section">
                <h3>{t.input}</h3>
                <textarea
                  className="format-textarea"
                  value={sqlInput}
                  onChange={(e) => setSqlInput(e.target.value)}
                  placeholder={t.placeholders.sql}
                  rows={10}
                />
                <div className="format-buttons">
                  <button onClick={() => clearFields('sql')}>{t.clear}</button>
                  <button onClick={formatSql} className="format-format-btn">{t.format}</button>
                </div>
              </div>
              
              <div className="format-output-section">
                <h3>{t.output}</h3>
                <textarea
                  className="format-textarea"
                  value={sqlOutput}
                  readOnly
                  rows={10}
                />
                <div className="format-buttons">
                  <button 
                    onClick={() => copyToClipboard(sqlOutput)} 
                    disabled={!sqlOutput}
                    className="format-copy-btn"
                  >
                    {t.copy}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

 
        {activeTab === 'yaml' && (
          <div className="format-block">
            <h2>{t.yamlTitle}</h2>
            <div className="format-editor-container">
              <div className="format-input-section">
                <h3>{t.input}</h3>
                <textarea
                  className="format-textarea"
                  value={yamlInput}
                  onChange={(e) => setYamlInput(e.target.value)}
                  placeholder={t.placeholders.yaml}
                  rows={10}
                />
                <div className="format-buttons">
                  <button onClick={() => clearFields('yaml')}>{t.clear}</button>
                  <button onClick={formatYaml} className="format-format-btn">{t.format}</button>
                </div>
              </div>
              
              <div className="format-output-section">
                <h3>{t.output}</h3>
                <textarea
                  className="format-textarea"
                  value={yamlOutput}
                  readOnly
                  rows={10}
                />
                <div className="format-buttons">
                  <button 
                    onClick={() => copyToClipboard(yamlOutput)} 
                    disabled={!yamlOutput}
                    className="format-copy-btn"
                  >
                    {t.copy}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="format-block">
            <h2>{t.codeTitle}</h2>
            <div className="format-code-options">
              <label>
                {t.languageSelect}
                <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)}>
                  {Object.entries(t.languages).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="format-editor-container">
              <div className="format-input-section">
                <h3>{t.input}</h3>
                <textarea
                  className="format-textarea"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={t.placeholders.code(t.languages[codeLanguage])}
                  rows={10}
                />
                <div className="format-buttons">
                  <button onClick={() => clearFields('code')}>{t.clear}</button>
                  <button onClick={formatCode} className="format-format-btn">{t.format}</button>
                </div>
              </div>
              
              <div className="format-output-section">
                <h3>{t.output}</h3>
                <textarea
                  className="format-textarea"
                  value={codeOutput}
                  readOnly
                  rows={10}
                />
                <div className="format-buttons">
                  <button 
                    onClick={() => copyToClipboard(codeOutput)} 
                    disabled={!codeOutput}
                    className="format-copy-btn"
                  >
                    {t.copy}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="format-footer">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default Format;