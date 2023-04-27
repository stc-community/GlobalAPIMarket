const { networkConfig } = require("../../helper-hardhat-config");

task("create-order", "Calls an STCDao Contract to create dao")
  .addOptionalParam(
    "contract",
    "The address of the STCDao contract that you want to call"
  )
  .addParam("daoId", "daoId")
  .addParam("marketId", "marketId")
  .addParam("totalCalls", "totalCalls")
  .addParam("orderPrice", "orderPrice")
  .setAction(async taskArgs => {
    const networkId = network.config.chainId;
    const contractAddr =
      taskArgs.contract || networkConfig[networkId]["stcToken"];
    const daoId = taskArgs.daoId;
    const description = taskArgs.marketId;
    const jsoninfo = taskArgs.totalCalls;
    const image = taskArgs.orderPrice;

    console.log("Contract:", contractAddr, "network:", network.name);

    const STCDaoTokenContract = await ethers.getContractAt(
      "STCDaoToken",
      contractAddr
    );

    const result = await STCDaoTokenContract.createOrder(
      daoId,
      description,
      jsoninfo,
      image
    );
    console.log("Contract:", contractAddr, "Transaction Hash: ", result.hash);
  });
module.exports = {};
