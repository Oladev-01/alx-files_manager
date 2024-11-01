import DbClient from './utils/db';

const waitConnection = () => new Promise((res, rej) => {
  let i = 0;
  const repeatFct = async () => {
    await setTimeout(() => {
      i += 1;
      if (i >= 10) {
        rej();
      } else if (!DbClient.isAlive()) {
        repeatFct();
      } else {
        res();
      }
    }, 1000);
  };
  repeatFct();
});

(async () => {
  console.log(DbClient.isAlive());
  await waitConnection();
  console.log(DbClient.isAlive());
  console.log(await DbClient.nbUsers());
  console.log(await DbClient.nbFiles());
})();
