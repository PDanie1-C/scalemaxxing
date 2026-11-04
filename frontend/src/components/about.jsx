import '../styles/style.css';
import styles from '../styles/inlineStyles'
import logo from '../assets/logo.svg';

import { IoIosArrowBack } from "react-icons/io";
import contributors from '../data/contributors';

import StudentCard from './studentCard';

function About({ onBack }) {
	return (
		<div style={styles.page} className='about-page'>
			<header className="header">
        <div className="header-content">
					<button className="back-button buttonPrimary" onClick={onBack}>
						<span ><IoIosArrowBack className="back-arrow"/></span>
						<p>Back</p>
					</button>

					<h1 className="brand">ScaleMAXXING</h1>
					<p className="description">
						Lorem ipsum dolor sit amet consectetur adipiscing elit cillum nulla amet,
						eiusmod anim at. Ut adipiscing laboris at id eiusmod eiusmod ad sint ipsum
						occaecat veniam deserunt aliquip. Exercitation justo cupidatat reprehenderit
						occaecat excepteur occaecat ex. Irure id nisi veniam, velit qui odio
						reprehenderit cupidatat et adipiscing ex labore. Do enim fugiat anim
						proident minim. Mollit velit at ea consequat accusamus.
					</p>
        </div>

        <img className='logo' src={logo} alt="Logo"/>
			</header>

			<main className="student-grid">
				{contributors.map((contributor) => (
					<StudentCard
						key={contributor.id}
						name={contributor.name}
						image={contributor.image}
					/>
				))}
			</main>
		</div>
	);
}


{/* <button onClick={onBack}>BACK!!!</button> */}


export default About;