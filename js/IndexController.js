// import { ethers } from "ethers";
var ABI;
var transactionUrl;
const viewOnOpenseaButton = document.getElementById('viewOnOpenseaButton')
const mintButton = document.getElementById('mintButton')


mintButton.style.display = 'none'
fetch('https://uetar.mypinata.cloud/ipfs/QmYEoXqvGVhP7LFK5pqV6obJvmzu49QJT7fxY4zxpsombB')
  .then(res => res.json())
  .then(data => ABI = data)
  .then(() => console.log(ABI))



const deployNetwork = 'EthereumTestRinkeby'
const networks = {
    EthereumTestRinkeby: {
      "chainId": `0x${Number(4).toString(16)}`,
    },
    EthereumMainNet: {
      "chainId": `0x${Number(1).toString(16)}`,
    }
  }
const changeNetwork = async () => {
    try {
      if (!window.ethereum) {
        alert('You do not have metamask installed')
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            ...networks[deployNetwork]
          }
        ]
      })
    } catch (err) {
      alert(err.message)
    }
  }





const getSupply = async () => {
	const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const nftContract = new ethers.Contract('0xF5B6e48A6fbad96eEF0161b18a8AFC90ECF47149', ABI, signer);
	let supply = await nftContract.totalSupply()
  return supply
}



const mintButtonHandler = async () => {
    try {
      const { ethereum } = window;
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId != networks[deployNetwork]['chainId']) {
        alert(`make sure you are on ${deployNetwork} and try again`)
        changeNetwork()
      } else {
        if (ethereum) {
        	mintButton.disabled = true;
          
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const nftContract = new ethers.Contract('0xF5B6e48A6fbad96eEF0161b18a8AFC90ECF47149', ABI, signer);
          console.log('initialize payment')

          let nftTxn = await nftContract.mint(1, { value: ethers.utils.parseEther("0.01"), gasLimit: 3000000 })

          console.log('minting...')
          
          await nftTxn.wait()
          
          
          var modal = document.getElementById('successModal')
          modal.style.display = 'flex'
          transactionUrl = `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
          mintButton.disabled = false;

          
        } else {
          alert('etherum object not found')
        }

      }


    } catch (err) {
      console.log(err)
    }
  }
  
  const accountChangedHandler = (newAccount) => {
    var elem = document.getElementById("connectWalletButton");
    elem.innerHTML=newAccount
    alert(newAccount)
  }
  
  const nicePrintWallet = (walletString) => {
    return `${walletString.substring(0, 6)}....${walletString.substring(walletString.length - 7)}`
  }
  
  const connectWalletHandler = () => {
    if (window.ethereum) {
      //metamask installed
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {

          accountChangedHandler(nicePrintWallet(result[0]));
          mintButton.style.display = 'flex'
        })
    } else {
      alert('Metamask is not found');
    }
    
    getSupply().then(value => {afterWalletConnection(value)})
    


  }
  const closeModalHandler = () => {
  	var modal = document.getElementById('successModal')
  	modal.style.display = 'none'
  }
  
  const viewOnOpenseaButtonHandler = () => {
  	window.open(transactionUrl, '_blank').focus();
  }
  
  const afterWalletConnection = (newSupply) => {
  	document.getElementById('supplyHeading').innerHTML = `${newSupply}/1,777`
  }
  
	mintButton.addEventListener('click', mintButtonHandler)
  document.getElementById('connectWalletButton').addEventListener('click', connectWalletHandler)
  document.getElementById('closeModal').addEventListener('click', closeModalHandler)
  viewOnOpenseaButton.addEventListener('click', viewOnOpenseaButtonHandler)