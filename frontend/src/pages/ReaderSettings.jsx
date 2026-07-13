import React, { useState } from 'react';
import styles from './ReaderSettings.module.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Accordion = ({ title, isOpen, onToggle, children }) => (
  <div className={styles.accordion}>
    <button className={styles.accordionHeader} onClick={onToggle}>
      <span>{title}</span>
      <ChevronRight className={`${styles.accordionIcon} ${isOpen ? styles.open : ''}`} />
    </button>
    {isOpen && (
      <div className={styles.accordionContent}>
        {children}
      </div>
    )}
  </div>
);

export default function ReaderSettings({ isOpen, onClose, settings, updateSetting, resetSettings }) {
  const [openBlock, setOpenBlock] = useState('main');

  const toggleBlock = (block) => {
    setOpenBlock(prev => prev === block ? null : block);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Настройки читалки</h2>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={resetSettings} title="Сбросить настройки"><ResetIcon /></button>
            <button className={styles.iconBtn} onClick={onClose} title="Закрыть"><CloseIcon /></button>
          </div>
        </div>
        
        <div className={styles.content}>
          
          <Accordion title="Основные" isOpen={openBlock === 'main'} onToggle={() => toggleBlock('main')}>
            <div className={styles.settingGroup}>
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Все главы подряд</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.continuousReading} onChange={e => updateSetting('continuousReading', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.continuousReading ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>

              <div className={styles.settingGroupInner}>
                <span className={styles.groupLabel}>РЕЖИМ ЧТЕНИЯ</span>
                <div className={styles.segmentedControl}>
                  <button 
                    className={settings.readingMode === 'vertical' ? styles.activeSegment : styles.segmentBtn} 
                    onClick={() => updateSetting('readingMode', 'vertical')}
                  >
                    Вертикальный
                  </button>
                  <button 
                    className={settings.readingMode === 'horizontal' ? styles.activeSegment : styles.segmentBtn} 
                    onClick={() => updateSetting('readingMode', 'horizontal')}
                  >
                    Горизонтальный
                  </button>
                </div>
              </div>

              <div className={styles.settingGroupInner}>
                <span className={styles.groupLabel}>ТЕМА</span>
                <div className={styles.segmentedControl}>
                  {['dark', 'light', 'system'].map(t => (
                    <button 
                      key={t} 
                      className={settings.theme === t ? styles.activeSegment : styles.segmentBtn} 
                      onClick={() => updateSetting('theme', t)}
                    >
                      {t === 'dark' ? 'Тёмная' : t === 'light' ? 'Светлая' : 'Системная'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion title="Настройка изображения" isOpen={openBlock === 'image'} onToggle={() => toggleBlock('image')}>
            <div className={styles.settingGroup}>
              <div className={styles.settingGroupInner}>
                <span className={styles.groupLabel}>ВМЕЩАТЬ ИЗОБРАЖЕНИЯ</span>
                <div className={styles.segmentedControl}>
                  <button 
                    className={settings.imageFit === 'width' ? styles.activeSegment : styles.segmentBtn} 
                    onClick={() => updateSetting('imageFit', 'width')}
                  >
                    По ширине
                  </button>
                  <button 
                    className={settings.imageFit === 'height' ? styles.activeSegment : styles.segmentBtn} 
                    onClick={() => updateSetting('imageFit', 'height')}
                  >
                    По высоте
                  </button>
                </div>
              </div>

              <div className={styles.settingGroupInner}>
                <div className={styles.sliderHeader}>
                  <span className={styles.groupLabel}>ШИРИНА КОНТЕЙНЕРА</span>
                  <span className={styles.sliderValue}>{settings.containerWidth} PX</span>
                </div>
                <input 
                  type="range" min="400" max="1200" step="10" 
                  value={settings.containerWidth} 
                  onChange={e => updateSetting('containerWidth', Number(e.target.value))} 
                  className={styles.slider} 
                  style={{ '--val': `${((settings.containerWidth - 400) / (1200 - 400)) * 100}%` }}
                />
              </div>

              <div className={styles.settingGroupInner}>
                <div className={styles.sliderHeader}>
                  <span className={styles.groupLabel}>ЯРКОСТЬ ИЗОБРАЖЕНИЙ</span>
                  <span className={styles.sliderValue}>{settings.brightness}%</span>
                </div>
                <input 
                  type="range" min="20" max="100" step="5" 
                  value={settings.brightness} 
                  onChange={e => updateSetting('brightness', Number(e.target.value))} 
                  className={styles.slider} 
                  style={{ '--val': `${((settings.brightness - 20) / (100 - 20)) * 100}%` }}
                />
              </div>

              <div className={styles.settingGroupInner}>
                <div className={styles.sliderHeader}>
                  <span className={styles.groupLabel}>ОТСТУП МЕЖДУ СТРАНИЦАМИ</span>
                  <span className={styles.sliderValue}>{settings.pageGap} PX</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="2" 
                  value={settings.pageGap} 
                  onChange={e => updateSetting('pageGap', Number(e.target.value))} 
                  className={styles.slider} 
                  style={{ '--val': `${(settings.pageGap / 100) * 100}%` }}
                />
              </div>
              
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Оттенки серого</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.grayscale} onChange={e => updateSetting('grayscale', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.grayscale ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>
              
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Инверсия цветов</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.invert} onChange={e => updateSetting('invert', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.invert ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>

            </div>
          </Accordion>

          <Accordion title="Настройка скролла" isOpen={openBlock === 'scroll'} onToggle={() => toggleBlock('scroll')}>
            <div className={styles.settingGroup}>
              <div className={styles.settingGroupInner}>
                <div className={styles.sliderHeader}>
                  <span className={styles.groupLabel}>СКОРОСТЬ АВТОПРОКРУТКИ</span>
                  <span className={styles.sliderValue}>{settings.autoScrollSpeed}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={settings.autoScrollSpeed} 
                  onChange={e => updateSetting('autoScrollSpeed', Number(e.target.value))} 
                  className={styles.slider} 
                  style={{ '--val': `${settings.autoScrollSpeed}%` }}
                />
              </div>

              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Плавная прокрутка</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.smoothScroll} onChange={e => updateSetting('smoothScroll', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.smoothScroll ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>
            </div>
          </Accordion>

          <Accordion title="Настройка горячих клавиш" isOpen={openBlock === 'hotkeys'} onToggle={() => toggleBlock('hotkeys')}>
            <div className={styles.settingGroup}>
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Включить клавиши (Стрелки)</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.hotkeysEnabled} onChange={e => updateSetting('hotkeysEnabled', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.hotkeysEnabled ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>
              <div className={styles.hintText}>
                Используйте стрелки Влево/Вправо для навигации между страницами в горизонтальном режиме.
              </div>
            </div>
          </Accordion>

          <Accordion title="Другие настройки" isOpen={openBlock === 'other'} onToggle={() => toggleBlock('other')}>
            <div className={styles.settingGroup}>
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Полноэкранный режим</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.fullscreen} onChange={e => updateSetting('fullscreen', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.fullscreen ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>
              
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Нумерация страниц</span>
                <div className={styles.toggleWrapper}>
                  <input type="checkbox" checked={settings.showPageNumbers} onChange={e => updateSetting('showPageNumbers', e.target.checked)} className={styles.hiddenCheckbox} />
                  <div className={`${styles.toggleSwitch} ${settings.showPageNumbers ? styles.toggleOn : ''}`}>
                    <div className={styles.toggleKnob}></div>
                  </div>
                </div>
              </label>
            </div>
          </Accordion>
          
        </div>
      </div>
    </div>
  );
}
