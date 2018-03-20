import React from 'react';
import "../styles/faq.css";

const togglePanel = (e) => {
    e.target.nextSibling.classList.toggle('active');
}

export default () => {
    return (

        <div className="FAQ" >
            <button className="accordion" onClick={togglePanel}>Comment fonctionne la sélection des cuisines et des participants?
        </button>
            <div className="panel">
                <h5><div align="left">
                    Les cuisines et les cuisiniers sont sélectionnés via le formulaire et par contact direct pour introduction. Nous savons immédiatement quels candidats ont la motivation, le profil et partagent la même vision.</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>
                Qui détermine quelle cuisine et quel chef/entrepreneur travailleront ensemble?</button>
            <div className="panel">
                <h5><div align="left">
                    Un premier contact entre la cuisine et le chef/entrepreneur est faite par l'équipe CookWork. C'est la cuisine qui prend la décision finale pour accepter la demande.</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>Qui paie quoi?</button>
            <div className="panel">
                <h5><div align="left">
                    Le chef/entrepreneur paye un loyer ou ses heures qu'il a demandé, sans autres charges d'énergie; Le starter et l'hôte payent également une caution de base à la cuisine, mais il est remboursé après utilisation.</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>Je travaille avec un autre projet similaire dans la cuisine, et la concurrence?</button>
            <div className="panel">
                <h5><div align="left">
                    CookWork est l'extension du premier coworking culinaire en Belgique Co-oking. Le concept fonctionne depuis 2 ans et ne fait qu'évoluer. L'esprit de compétition n'est pas la dynamique sur laquelle s'est construit ce réseaux, mais plutôt celui de la communauté, enfin un groupe qui vous convient pour démarrer votre affaire! </div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>Que faire si quelque chose ne va pas avec le chef/entrepreneur (financier, accident, ...)?</button>
            <div className="panel">
                <h5><div align="left">
                    Chaque chef/entrepreneur doit être assuré. De cette façon, vous êtes protégé en cas d'incendie, d'accident ou d'autres dommages, et ce pendant toute la période de production</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>La cuisine peut-elle décider d'arrêter la collaboration?</button>
            <div className="panel">
                <h5><div align="left">
                    La cuisine décide après la première production de poursuivre ou non la collaboration. Pendant la période d'essai, la collaboration ne peut être rompue que pour des raisons urgentes.</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>De manière pratique, qui s'occupe de l'organisation dans la cuisine / le restaurant?</button>
            <div className="panel">
                <h5><div align="left">
                    Chaque entreprise de restauration est différente, et c'est pourquoi l'organisation pratique est organisée en consultation avec la cuisine.</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>Qu'en est-il de la sécurité alimentaire?</button>
            <div className="panel">
                <h5><div align="left">
                    Chaque chef/entrepreneur doit avoir un certificat AFSCA. Vous devez demander ce document en ligne sur www.afsca.be avant le début de votre projet</div></h5>
            </div>

            <button className="accordion" onClick={togglePanel}>En tant que chef/entrepreneur, dois-je payer quelque chose après l'utilisation?</button>
            <div className="panel">
                <h5><div align="left">
                    La seule chose que vous devez faire après la période d'essai est de profiter de votre propre entreprise!</div></h5>
            </div>
        </div>
    )
}
