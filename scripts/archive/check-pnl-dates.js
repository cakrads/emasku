
function getDates() {
  const now = new Date();
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibNow = new Date(now.getTime() + wibOffset);

  const getDateStr = (daysAgo) => {
    const d = new Date(wibNow);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  console.log('Current UTC Time:', now.toISOString());
  console.log('Current WIB (Approx):', new Date(now.getTime() + wibOffset).toISOString().replace('Z', ' +07:00'));
  console.log('-----------------------------------');
  console.log('Hari ini (T+0):', getDateStr(0));
  console.log('Kemarin (T-1):', getDateStr(1));
  console.log('7 hari lalu (T-7):', getDateStr(7));
  console.log('30 hari lalu (T-30):', getDateStr(30));
  console.log('365 hari lalu (T-365):', getDateStr(365));
}

getDates();
