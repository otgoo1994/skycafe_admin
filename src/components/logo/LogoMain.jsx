// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <>
      <p style={{ fontWeight: 700, fontSize: 20, padding: '0 30px' }}>SkyCafe</p>
    </>
  );
}
