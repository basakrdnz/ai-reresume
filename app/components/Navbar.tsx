import { Link } from "react-router";
import type {JSX} from "react";

const Navbar = (): JSX.Element => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">Reresume</p>
            </Link>

            <Link to="/upload" className="primary-button w-fit">
                Cv Yükle
            </Link>
        </nav>
    );
};

export default Navbar;
