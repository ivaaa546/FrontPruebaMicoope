import './AgenciaCard.css';

const AgenciaCard = ({ agencia }) => {
    const { nombre, direccion, telefono, municipios, horarios_agencia } = agencia;

    // Formatear horarios
    const formatearHorarios = () => {
        if (!horarios_agencia || horarios_agencia.length === 0) return null;

        const horariosOrdenados = [...horarios_agencia].sort(
            (a, b) => a.dias_semana.orden - b.dias_semana.orden
        );

        // Agrupar por tipo de horario
        const lunesViernes = horariosOrdenados.filter(h => h.dias_semana.orden <= 5);
        const sabado = horariosOrdenados.find(h => h.dias_semana.orden === 6);
        const domingo = horariosOrdenados.find(h => h.dias_semana.orden === 7);

        const formatHora = (h) => {
            if (h.cerrado) return 'Cerrado';
            return `${h.hora_apertura?.slice(0, 5)} - ${h.hora_cierre?.slice(0, 5)}`;
        };

        return (
            <div className="horarios">
                {lunesViernes.length > 0 && (
                    <p><strong>Lun-Vie:</strong> {formatHora(lunesViernes[0])}</p>
                )}
                {sabado && (
                    <p><strong>Sábado:</strong> {formatHora(sabado)}</p>
                )}
                {domingo && (
                    <p><strong>Domingo:</strong> {formatHora(domingo)}</p>
                )}
            </div>
        );
    };

    return (
        <div className="agencia-card">
            <div className="card-header">
                <h3>{nombre}</h3>
            </div>

            <div className="card-body">
                <div className="info-row">
                    <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a5f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <div>
                        <p className="label">Dirección</p>
                        <p>{direccion}</p>
                        <p className="municipio">
                            {municipios?.nombre}, {municipios?.departamentos?.nombre}
                        </p>
                    </div>
                </div>

                <div className="info-row">
                    <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a5f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <div>
                        <p className="label">Teléfono</p>
                        <p>{telefono}</p>
                    </div>
                </div>

                <div className="info-row">
                    <svg className="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a5f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <div>
                        <p className="label">Horarios</p>
                        {formatearHorarios()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgenciaCard;
