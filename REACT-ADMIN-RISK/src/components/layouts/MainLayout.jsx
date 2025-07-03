import { CssBaseline } from "@mui/material";
import SideBar from "../global/SideBar";
import NavBar from "../global/NavBar";

const MainLayout = ({ children }) => {
    return (
        <>
            <CssBaseline />
            <div className='app'>
                <SideBar />
                <main className='content'>
                    <NavBar />
                    {children}
                </main>
            </div>
        </>
    );
};

export default MainLayout;
