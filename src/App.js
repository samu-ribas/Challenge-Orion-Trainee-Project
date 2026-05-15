import React, { useState, useRef, useEffect } from 'react';
import './App.css';

import terraImg from './assets/terra.png';
import lupaImg from './assets/lupa-grande.png';
import placaImg from './assets/placaDePetre.png';
import logoOrion from './assets/logo-orion.png';
import setaBaixo from './assets/seta-baixo.png';
import lupaMenor from './assets/icone-lupa-menor.png';
import logoStardust from './assets/logo-stardust.png';
import logoKafsima from './assets/logo-kafsima.png';
import foto1 from './assets/foto1.png';
import foto4 from './assets/foto4.png';
import foto3 from './assets/foto3.png';
import foto2 from './assets/foto2.png';


const App = () => {
    // ESTADOS
    const [activeModal, setActiveModal] = useState(null); // kafsima, stardust e sobre
    const [activeImage, setActiveImage] = useState(null); // armazena a imagem da galeria aberta
    const [isDragging, setIsDragging] = useState(false);
    const [lupaPos, setLupaPos] = useState({ x: 0, y: 0 });
    const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0, bgSize: '0px' });
    const [isLensVisible, setIsLensVisible] = useState(false);

    const [etapa, setEtapa] = useState("login");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    // REFS 
    const earthImgRef = useRef(null);
    const earthContainerRef = useRef(null);
    const areasSectionRef = useRef(null);
    const topRef = useRef(null);
    // NAV E PESQUISA 
    const scrollToAreas = () => {
        areasSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToTop = (e) => {
        if(e) e.preventDefault();
      // scroll global da janela para a coordenada 0,0
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
    };

    const handleSearch = (e) => {
        if(e.key === 'Enter') 
        {
            const termo = e.target.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if(['kafsima', 'stardust', 'sobre', 'orion'].includes(termo)) 
            {
                const target = termo === 'orion' ? 'sobre' : termo;
                setActiveModal(target);
                scrollToAreas();
                e.target.value = '';
            } 
            else 
            {
                e.target.style.border = "1px solid #ef4444";
                setTimeout(() => e.target.style.border = "none", 800);
            }
        }
    };

    // LENTE INTERATIVA
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        document.body.style.cursor = 'none';
    };


    useEffect(() => {
        const handleGlobalMove = (e) => {
            if(isDragging) 
                setLupaPos({ x: e.clientX, y: e.clientY });
        };
        const handleGlobalUp = () => {
            if(isDragging)
            {
                setIsDragging(false);
                setIsLensVisible(false);
                document.body.style.cursor = 'default';
            }
        };
        
        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [isDragging]);


    const handleEarthMove = (e) => {
        if (!isDragging || !earthImgRef.current) 
            return;

        const zoom = 1.23;
        const img = earthImgRef.current;
        const imgRect = img.getBoundingClientRect();
        const containerRect = earthContainerRef.current.getBoundingClientRect();

        const x = e.clientX - imgRect.left;
        const y = e.clientY - imgRect.top;
        const ajusteY = -40;

        const offsetX = imgRect.left - containerRect.left;
        const offsetY = imgRect.top - containerRect.top;

        setLensPos({
            left: x + offsetX,
            top: y + offsetY + ajusteY,
            bgX: -((x) * zoom - (155 / 2)), // 155 é o tamanho da lente
            bgY: -((y + ajusteY) * zoom - (155 / 2)),
            bgSize: `${img.offsetWidth * zoom}px ${img.offsetHeight * zoom}px`
        });
    };


    /**
     * BLOCO DE VERIFICAÇÃO DE LOGIN
     */
    const emailValido = (email) => {
        return /^[^\s@]+@gmail\.com$/.test(email.toLowerCase());
    };

    const salvarCadastro = () => {
        setErro("");
        // verifica se está vazio
        if(!nome || !email || !senha){
            setErro("Preencha todos os campos.");
            return;
        }
        /*manda email pra verificação*/
        if(!emailValido(email)){
            setErro("Use um email válido do Gmail (@gmail.com).");
            return;
        }

        /**pega o usuário do brownser */
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        /*verifica se email ja existe*/
        const emailJaExiste = usuarios.some((u) => u.email === email);
        if(emailJaExiste){
            setErro("Esse email já está cadastrado.");
            return;
        }

        usuarios.push({ nome, email, senha });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        setNome("");
        setEmail("");
        setSenha("");
        setEtapa("login");
        alert("Cadastro realizado com sucesso!");
    };

  const fazerLogin = () => {
        setErro("");

        if(!email || !senha){
            setErro("Preencha email e senha.");
            return;
        }

        if(!emailValido(email)){
            setErro("Use um email válido do Gmail (@gmail.com).");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        const usuario = usuarios.find(
            (u) => u.email === email && u.senha === senha
        );

        if(!usuario){
            setErro("Email ou senha incorretos.");
            return;
        }

        alert(`Bem-vindo, ${usuario.nome}!`);
        setEtapa("dashboard");
    };


    return (
        <div className="app-wrapper">
            {etapa === 'dashboard' ? (
                <>
                    {(activeModal || activeImage) && (
                        <div className="blur-overlay active" onClick={() => { setActiveModal(null); setActiveImage(null); }} />
                    )}

                    <header ref={topRef}>
                        <nav className="navbar">

                            <div className="logo">
                                <img src={logoOrion} alt="Logo Orion" />
                                <div className="logo-text"><span>ORION</span><small>Aerospace Design</small></div>
                            </div>

                            <ul className="nav-links">
                                <li onClick={scrollToTop}>Início</li>
                                
                                <li className={activeModal === 'kafsima' ? 'active' : ''} 
                                    onClick={() => { setActiveModal('kafsima'); scrollToAreas(); }} >Káfsima</li>
                                
                                <li className={activeModal === 'stardust' ? 'active' : ''} 
                                    onClick={() => { setActiveModal('stardust'); scrollToAreas(); }} >Stardust</li>
                                
                                <li className={activeModal === 'sobre' ? 'active' : ''} 
                                    onClick={() => setActiveModal('sobre')} >Sobre a Orion</li>

                                <li onClick={() => setEtapa('login')} style={{ color: '#ef4444' }}>Sair</li>
                            </ul>

                            <div className="search-bar">
                                <img src={lupaMenor} alt="Busca" />
                                <input type="text" placeholder="Pesquisar..." onKeyDown={handleSearch} />
                            </div>

                        </nav>
                    </header>

                    <main>
                        <section id="hero" className="hero-section">

                            <div className="hero-header-text">
                                <h6>DIRETORIA DE PESQUISA</h6>
                                <h1>Exploração Sem Limites</h1>
                            </div>

                            <div className="hero-content">
                                <div className="hero-sidebar">
                                    <div className="topic"><h2>Stardust</h2><p>Astrobiologia e a Cápsula UP</p></div>
                                    <div className="topic"><h2>Káfsima</h2><p>Propulsão sustentável</p></div>
                                </div>

                                <div className="earth-container" ref={earthContainerRef}>
                                    <img 
                                        ref={earthImgRef}
                                        src={terraImg}
                                        className="earth-img" 
                                        onMouseEnter={() => isDragging && setIsLensVisible(true)}
                                        onMouseLeave={() => setIsLensVisible(false)}
                                        onMouseMove={handleEarthMove}
                                        alt="Terra"
                                    /> 
                                    <div 
                                        className={`lens ${isLensVisible ? 'active' : ''}`}
                                        style={{
                                            left: lensPos.left,
                                            top: lensPos.top,
                                            backgroundPosition: `${lensPos.bgX}px ${lensPos.bgY}px`,
                                            backgroundSize: lensPos.bgSize,
                                            backgroundImage: {placaImg}
                                        }}
                                    />
                                </div>

                                <div className="lens-instruction">
                                    <img 
                                        src={lupaImg}
                                        className={`lupa-icon ${isDragging ? 'dragging' : ''}`} 
                                        onMouseDown={handleMouseDown}
                                        style={isDragging ? { left: lupaPos.x, top: lupaPos.y, position: 'fixed' } : {}}
                                        alt="lupa"
                                    />
                                    <p><strong>{isDragging ? 'SOLTE PARA GUARDAR' : 'LENTE ATIVA'}</strong><br/>Passe sobre a terra para revelar microorganismos</p>
                                </div>
                            </div>

                            <div className="scroll-indicator" onClick={scrollToAreas}>
                                <img src={setaBaixo} alt="Seta"/>
                            </div>
                        </section>

                        <section id="areas" className="areas-section" ref={areasSectionRef}>
                            {/* CARD STARDUST */}
                            <div className={`card stardust-bg ${activeModal === 'stardust' ? 'popup-active' : ''}`}>
                                <div className="card-header">
                                    <h2>Stardust</h2>
                                    <img src={logoStardust} alt="Stardust" />
                                </div>
                                <p>A divisão Stardust é especializada na coleta e análise de poeira cósmica e microorganismos extremófilos. Nossa missão é compreender como moléculas complexas sobrevivem no vácuo e mapear os blocos construtores da vida espalhados pelo universo.</p>
                            </div>

                            {/* CARD KAFSIMA */}
                            <div className={`card kafsima-bg ${activeModal === 'kafsima' ? 'popup-active' : ''}`}>
                                <div className="card-header">
                                    <h2>Káfsima</h2>
                                    <img src={logoKafsima} alt="Káfsima" />
                                </div>
                                <p>Tem como objetivo produzir, testar e aperfeiçoar um biodiesel a partir de microalgas. Foco: O biocombustível será o objeto de pesquisa, produção publicações científicas.<br></br>.</p>
                            </div>
                        </section>

                        {/* ACERVO */}
                        <section id="acervo" className="acervo-section">
                            <h2>Acervo do Projeto Orion</h2>
                            <p>Imagens e referências da área de pesquisa do projeto.</p>
                            
                            <div className="gallery-container">
                                <div className="gallery-row">
                                    <img 
                                        src={foto1} alt="Pesquisa em campo 1" 
                                        className={`gallery-img ${activeImage === 'foto1' ? 'img-popup-active' : ''}`}
                                        onClick={() => setActiveImage(activeImage === 'foto1' ? null : 'foto1')}
                                    />
                                    <img 
                                        src={foto4} alt="Equipamento de laboratório" 
                                        className={`gallery-img ${activeImage === 'foto4' ? 'img-popup-active' : ''}`}
                                        onClick={() => setActiveImage(activeImage === 'foto4' ? null : 'foto4')}
                                    />
                                    <img 
                                        src={foto3} alt="Pesquisa em campo 2" 
                                        className={`gallery-img ${activeImage === 'foto3' ? 'img-popup-active' : ''}`}
                                        onClick={() => setActiveImage(activeImage === 'foto3' ? null : 'foto3')}
                                    />
                                </div>
                                
                                {/* Foto circular*/}
                                <div className="gallery-row-bottom">
                                    <img 
                                        src={foto2} 
                                        alt="Visão microscópica" 
                                        className={`gallery-img circle-img ${activeImage === 'foto2' ? 'img-popup-active' : ''}`}
                                        onClick={() => setActiveImage(activeImage === 'foto2' ? null : 'foto2')}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* MODAL SOBRE */}
                        <div className={`about-modal ${activeModal === 'sobre' ? 'active' : ''}`}>
                            <h2>Sobre a Orion</h2>
                            <p>A Orion Aerospace Design é uma equipe de Competição e Extensão da UTFPR-PG. Criada em 2020, temos como missão desenvolver minifoguetes e nanosatélites, realizar pesquisas em astrobiologia e aproximar a ciência da comunidade. A Orion é organizada em cinco grandes áreas: Administrativo, Aerodinâmica, Computação, Extensão e Pesquisa.</p>
                        </div>
                    </main>

                    {activeImage && <div className="popup-caption active">Pesquisa em laboratório</div>}

                    <footer>
                    <p>ORION AEROSPACE</p>
                    <p><small>© 2026 Orion Aerospace Design. Desenvolvido para o Desafio Trainee - Projeto Orion<br></br>Áreas de Pesquisa: Stardust & Káfsima.</small></p>
                    </footer>
                </>
            ) : (
                <div className="auth-container">
                    {etapa === 'login' && (
                        <div className="auth-screen">
                            <img src={logoOrion} alt="Logo Orion" className="auth-logo" />
                            <h2 className="auth-title">Login Orion</h2>
                            {/*pagina de longin do usuário*/}
                            <input 
                                type="email" 
                                placeholder="Email"  
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            {erro && <p style={{ color: "salmon" }}>{erro}</p>}
                            <button onClick={fazerLogin}>Entrar</button>
                            <p onClick={() => setEtapa("cadastro")} style={{ cursor: "pointer" }}>Não tem conta? Cadastre-se</p>
                        </div>
                    )}

                    {etapa === 'cadastro' && (
                        <div className="auth-screen">
                            <img src={logoOrion} alt="Logo Orion" className="auth-logo" />
                            <h2 className="auth-title">Cadastro Orion</h2>
                            {/*pagina de cadastro do usuário*/}
                            <input
                                type="text"
                                placeholder="Nome Completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />

                            {erro && <p style={{ color: "salmon" }}>{erro}</p>}
                            <button onClick={salvarCadastro}>Finalizar Cadastro</button>
                            <p onClick={() => setEtapa("login")} style={{ cursor: "pointer" }}>Já tem conta? Voltar ao Login</p>
                        </div>
                    )}
                </div>

                
            )}
        </div>
    );
};

export default App;