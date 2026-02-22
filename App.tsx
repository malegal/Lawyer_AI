import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  
  // إعدادات التطبيق
  const [query, setQuery] = useState('');
  const [aiProvider, setAiProvider] = useState('groq');
  const [searchProvider, setSearchProvider] = useState('tavily');
  const [modelName, setModelName] = useState('llama3-70b-8192');
  
  // مفاتيح API
  const [keys, setKeys] = useState({
    groq: '',
    openrouter: '',
    tavily: ''
  });

  // النتيجة والحالة
  const [status, setStatus] = useState('');
  const [output, setOutput] = useState('');

  // استرجاع المفاتيح من الذاكرة المحلية عند فتح التطبيق
  useEffect(() => {
    setKeys({
      groq: localStorage.getItem('groq-key') || '',
      openrouter: localStorage.getItem('openrouter-key') || '',
      tavily: localStorage.getItem('tavily-key') || ''
    });
  }, []);

  const saveKeys = () => {
    localStorage.setItem('groq-key', keys.groq);
    localStorage.setItem('openrouter-key', keys.openrouter);
    localStorage.setItem('tavily-key', keys.tavily);
    setStatus('✅ تم حفظ المفاتيح في هاتفك بنجاح!');
    setTimeout(() => setStatus(''), 3000);
    setShowSettings(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setStatus('⚠️ الرجاء إدخال تفاصيل البحث أولاً');
      return;
    }
    setStatus('⏳ جاري إعداد المذكرة... الرجاء الانتظار');
    
    // هنا سيتم إضافة منطق IndexedDB والـ API لاحقاً
    // هذا مجرد محاكاة لواجهة المستخدم حتى نتأكد من عمل التطبيق
    setTimeout(() => {
      setOutput(`هذه نتيجة مبدئية لاختبار الواجهة على الأندرويد.\n\nموضوع البحث: ${query}\nالنموذج المستخدم: ${modelName}`);
      setStatus('✅ تم الانتهاء!');
    }, 2000);
  };

  const copyText = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setStatus('📋 تم النسخ بنجاح!');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <div className="glass-container">
      <h1>المحامي AI ⚖️</h1>

      {/* زر إظهار/إخفاء الإعدادات (مهم جداً للهاتف) */}
      <button 
        className="settings-toggle" 
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? '▲ إخفاء الإعدادات والمفاتيح' : '▼ إظهار الإعدادات (النماذج والمفاتيح)'}
      </button>

      {/* قسم الإعدادات (يظهر فقط عند الضغط) */}
      {showSettings && (
        <div className="settings-panel">
          <label>مزود الذكاء الاصطناعي:</label>
          <select value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
            <option value="groq">Groq (الأساسي)</option>
            <option value="openrouter">OpenRouter (احتياطي)</option>
          </select>

          <label>محرك البحث:</label>
          <select value={searchProvider} onChange={(e) => setSearchProvider(e.target.value)}>
            <option value="tavily">Tavily (الأساسي)</option>
            <option value="google">Google (احتياطي)</option>
          </select>

          <label>اسم النموذج:</label>
          <input 
            type="text" 
            value={modelName} 
            onChange={(e) => setModelName(e.target.value)} 
          />

          <label>مفتاح Groq API:</label>
          <input 
            type="password" 
            value={keys.groq} 
            onChange={(e) => setKeys({...keys, groq: e.target.value})} 
          />

          <label>مفتاح OpenRouter API:</label>
          <input 
            type="password" 
            value={keys.openrouter} 
            onChange={(e) => setKeys({...keys, openrouter: e.target.value})} 
          />

          <label>مفتاح Tavily API:</label>
          <input 
            type="password" 
            value={keys.tavily} 
            onChange={(e) => setKeys({...keys, tavily: e.target.value})} 
          />

          <button onClick={saveKeys} style={{ background: '#28a745', color: '#fff' }}>
            حفظ الإعدادات
          </button>
        </div>
      )}

      {/* قسم البحث الرئيسي */}
      <div>
        <label>موضوع المذكرة أو البحث القانوني:</label>
        <textarea 
          rows={5} 
          placeholder="اكتب تفاصيل القضية أو الأمر القانوني هنا..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>إعداد المذكرة وبدء البحث</button>
      </div>

      {/* حالة النظام */}
      {status && <div className="status">{status}</div>}

      {/* قسم النتيجة */}
      {output && (
        <div style={{ marginTop: '20px' }}>
          <label>النتيجة:</label>
          <div className="output-box">{output}</div>
          
          <div className="action-buttons">
            <button onClick={copyText}>نسخ</button>
            <button onClick={() => alert('سيتم تفعيل تصدير الوورد في الخطوة القادمة')}>Word تصدير</button>
          </div>
        </div>
      )}
    </div>
  );
}
