import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useCustomImageGenerator } from './hooks/useCustomImageGenerator';

const App = () => {
    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [blendMode, setBlendMode] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');

    const { generatedImage, loading, error, generate } = useCustomImageGenerator();

    const BLEND_MODES = ['Fuse', 'Sample', 'Reffer', 'Smash', 'Mash'];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageSetter: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                imageSetter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = () => {
        if (image1 && image2 && blendMode) {
            generate(image1, image2, blendMode, prompt);
        }
    };
    
    const isFormComplete = image1 && image2 && blendMode;

    const styles: { [key: string]: React.CSSProperties } = {
        main: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            gap: '2rem',
        },
        header: {
            textAlign: 'center',
        },
        title: {
            fontFamily: "'Teko', sans-serif",
            fontSize: '4rem',
            color: 'var(--primary-color)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
        },
        subtitle: {
            color: 'var(--on-surface-color)',
            fontSize: '1rem',
            marginTop: '-0.5rem',
        },
        container: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            width: '100%',
            maxWidth: '1200px',
        },
        controls: {
            background: 'var(--surface-color)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        },
        imageUploads: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between',
        },
        uploadBox: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--border-color)',
            borderRadius: '8px',
            height: '150px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.3s, background-color 0.3s',
        },
        uploadBoxHover: {
           borderColor: 'var(--primary-color)',
           backgroundColor: '#2a2a2a',
        },
        uploadIcon: {
            fontSize: '2rem',
            color: 'var(--on-surface-color)',
        },
        uploadText: {
            fontSize: '0.9rem',
            color: 'var(--on-surface-color)',
            marginTop: '0.5rem',
        },
        imagePreview: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
        },
        removeButton: {
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            zIndex: 2,
        },
        sectionTitle: {
            fontSize: '1.2rem',
            fontWeight: 500,
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem',
        },
        blendModes: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
        },
        blendButton: {
            padding: '0.5rem 1rem',
            border: '1px solid var(--border-color)',
            background: 'var(--background-color)',
            color: 'var(--on-surface-color)',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
        },
        blendButtonSelected: {
            backgroundColor: 'var(--primary-color)',
            color: 'var(--background-color)',
            borderColor: 'var(--primary-color)',
            fontWeight: 'bold',
        },
        promptInput: {
            width: '100%',
            minHeight: '80px',
            background: 'var(--background-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: 'var(--on-surface-color)',
            fontSize: '1rem',
            resize: 'vertical',
        },
        generateButton: {
            padding: '1rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: `linear-gradient(45deg, var(--primary-color), var(--secondary-color))`,
            color: 'var(--background-color)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'opacity 0.3s, transform 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
        },
        generateButtonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
        result: {
            background: 'var(--surface-color)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px',
            position: 'relative'
        },
        generatedImageContainer: {
            width: '100%',
            paddingTop: '100%', /* 1:1 Aspect Ratio */
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'var(--background-color)',
        },
        generatedImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },
        placeholder: {
            textAlign: 'center',
            color: 'var(--on-surface-color)',
        },
        spinner: {
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTop: '4px solid var(--primary-color)',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
        },
        error: {
            color: 'var(--error-color)',
            textAlign: 'center',
        },
        downloadButton: {
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 500,
          background: 'var(--surface-color)',
          color: 'var(--primary-color)',
          border: '1px solid var(--primary-color)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s, color 0.3s',
          textDecoration: 'none',
          textAlign: 'center',
        },
        responsiveContainer: {
            '@media (maxWidth: 900px)': {
                gridTemplateColumns: '1fr',
            },
        },
    };
    
    // Add keyframes for spinner animation
    const keyframes = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const ImageUploader = ({ image, onUpload, onRemove, label }: { image: string | null, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void, label: string }) => {
        const [isHovered, setIsHovered] = useState(false);
        return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{...styles.uploadBox, ...(isHovered && !image ? styles.uploadBoxHover : {})}} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <input type="file" accept="image/png, image/jpeg" onChange={onUpload} style={{ display: 'none' }} aria-label={`Upload ${label}`} />
                    {image ? (
                        <>
                            <button type="button" style={styles.removeButton} onClick={(e) => {e.preventDefault(); onRemove();}} aria-label={`Remove ${label}`}>X</button>
                            <img src={image} alt="Preview" style={styles.imagePreview} />
                        </>
                    ) : (
                        <>
                            <span style={styles.uploadIcon}>🖼️</span>
                            <span style={styles.uploadText}>{label}</span>
                        </>
                    )}
                </label>
            </div>
        );
    };

    return (
        <main style={styles.main}>
            <style>{keyframes}</style>
            <header style={styles.header}>
                <h1 style={styles.title}>AI Image Blender</h1>
                <p style={styles.subtitle}>by Massive Magnetics</p>
            </header>

            <div style={{...styles.container, '@media (maxWidth: 900px)': { gridTemplateColumns: '1fr' }}}>
                <div style={styles.controls}>
                    <h2 style={styles.sectionTitle}>1. Upload Your Images</h2>
                    <div style={styles.imageUploads}>
                        <ImageUploader image={image1} onUpload={(e) => handleImageUpload(e, setImage1)} onRemove={() => setImage1(null)} label="Image 1"/>
                        <ImageUploader image={image2} onUpload={(e) => handleImageUpload(e, setImage2)} onRemove={() => setImage2(null)} label="Image 2"/>
                    </div>

                    <h2 style={styles.sectionTitle}>2. Choose Blend Style</h2>
                    <div style={styles.blendModes}>
                        {BLEND_MODES.map(mode => (
                            <button 
                                key={mode} 
                                onClick={() => setBlendMode(mode)} 
                                style={{...styles.blendButton, ...(blendMode === mode ? styles.blendButtonSelected : {})}}
                                type="button"
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <h2 style={styles.sectionTitle}>3. Add Guidance (Optional)</h2>
                    <textarea 
                        style={styles.promptInput} 
                        placeholder="e.g., in the style of an oil painting, a surreal masterpiece, dark and gritty..." 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        aria-label="Additional guidance prompt"
                    />

                    <button 
                        style={{...styles.generateButton, ...(!isFormComplete || loading ? styles.generateButtonDisabled : {})}} 
                        onClick={handleGenerate} 
                        disabled={!isFormComplete || loading}
                    >
                        {loading && <div style={{...styles.spinner, width: '20px', height: '20px', borderTopColor: 'var(--background-color)', borderWidth: '2px'}}></div>}
                        Generate Image
                    </button>
                </div>

                <div style={styles.result}>
                    {loading && <div style={styles.spinner}></div>}
                    {error && !loading && <p style={styles.error}>{error}</p>}
                    {!loading && !error && generatedImage && (
                        <>
                          <div style={styles.generatedImageContainer}>
                              <img src={generatedImage} alt="Generated blend" style={styles.generatedImage}/>
                          </div>
                          <a href={generatedImage} download="generated-image.jpg" style={styles.downloadButton}>
                              Download Image
                          </a>
                        </>
                    )}
                    {!loading && !error && !generatedImage && (
                        <div style={styles.placeholder}>
                            <span style={{fontSize: '3rem', display: 'block', marginBottom: '1rem'}}>✨</span>
                            <h3 style={{fontSize: '1.2rem'}}>Your blended image will appear here</h3>
                            <p style={{color: 'var(--on-surface-color)'}}>Complete the steps on the left to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
