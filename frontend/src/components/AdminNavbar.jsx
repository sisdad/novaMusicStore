import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/AdminNavbar.css";


export default function AdminNavbar() {

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);



    const logout = () => {

        localStorage.clear();

        navigate("/login");

    };



    const closeMenu = () => {

        setMenuOpen(false);

    };



    return (

        <nav className="admin-navbar">


            <div className="navbar-brand">


                <div className="music-logo">

                    🎵

                </div>



                <div>

                    <h2>
                        Music Studio
                    </h2>

                    <span>
                        Admin Panel
                    </span>

                </div>


            </div>





            <button

                className="menu-toggle"

                onClick={() => setMenuOpen(!menuOpen)}

            >

                ☰

            </button>






            <div

                className={
                    menuOpen
                    ? "navbar-menu open"
                    : "navbar-menu"
                }

            >




                <NavLink

                    to="/admin/upload"

                    onClick={closeMenu}

                    className={({isActive}) =>
                        isActive ? "active" : ""
                    }

                >

                    🎶 Upload

                </NavLink>







                <NavLink

                    to="/generate-barcodes"

                    onClick={closeMenu}

                    className={({isActive}) =>
                        isActive ? "active" : ""
                    }

                >

                    ▣ Generate QR

                </NavLink>







                <NavLink

                    to="/admin/music"

                    onClick={closeMenu}

                    className={({isActive}) =>
                        isActive ? "active" : ""
                    }

                >

                    🎧 Library

                </NavLink>







                <button

                    className="logout-btn"

                    onClick={() => {

                        logout();

                        closeMenu();

                    }}

                >

                    ⎋ Logout

                </button>





            </div>




        </nav>

    );

}