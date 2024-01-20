import Image from "next/image";
import { connect, disconnect } from "get-starknet";
import { Inter } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";9

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [connection, setConnection] = useState("");
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const starknetConnect = async () => {
      const connection = await connect();
      if (connection && connection.isConnected) {
        setConnection(connection);
        setAccount(connection.account);
        setAddress(connection.selectedAddress);
      }
    }

    starknetConnect();
  }, [])

  const [students, setStudents] = useState([])
  const [currentStudent, setCurrentStudent] = useState()
  const [displayStudentDialog, setDisplayStudentDialog] = useState(false)

  const connectWallet = async () => {
    const connection = await connect();
    if (connection && connection.isConnected) {
      setConnection(connection);
      setAccount(connection.account);
      setAddress(connection.selectedAddress);
    }
  }

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(undefined);
    setAccount(undefined);
    setAddress("");
  }

  function displayDialogForAddingStudents() {
    setDisplayStudentDialog(true)
  }

  function closeDialogForAddingStudents() {
    setDisplayStudentDialog(false)
  }

  const addStudent = event => {
    event.preventDefault();
    /**
     * @type {HTMLFormElement}
     */
    const form = event.target;

    let student = {
      name: form.elements.name.value,
      age: form.elements.age.value,
      balance: form.elements.balance.value,
      address: form.elements.address.value,
    }

    console.log('student', student)

    setStudents([...students, student])
    alert('Added student: ' + student.name)
  }


  const retrieveStudentByAddress = event => {
    event.preventDefault()
    let address = event.target.elements.address.value

    // alert("Address given: " + address)
    let student = students.find(student => student.address == address)

    if (!student) {
      alert("No student with given wallet address found")
      return
    }

    // console.log('student with address', address, student)
    setCurrentStudent(student)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {
        connection ? (<>
          <button onClick={disconnectWallet}>Disconnect</button>
          <p>{address}</p>      
        </>) : (
            <button onClick={connectWallet}>Connect Wallet</button>
        )
      }

      {
        displayStudentDialog
          ? (
            <div style={{zIndex: 2, border: "1px solid black",}}>

              <button
                style={{backgroundColor: 'red', color: 'white', fontWeight: 'bold'}}
                onClick={closeDialogForAddingStudents}
              >&times;</button>

              <h2 className="bg-gray-300 hover:shadow-md px-4 py-2 border-1 rounded" style={{textAlign: 'center', marginBottom: '10px', marginLeft: "70px", marginRight: "70px", }}>Add Student</h2>

              <form id="studentForm" onSubmit={addStudent}>
                <label>
                    Name:
                    <input type="text" name="name" style={{marginLeft: '30px', marginBottom: '10px'}}/>
                </label> <br></br>
                <label>
                  Age:
                  <input type="number" name="age" style={{marginLeft: '45px', marginBottom: '10px'}}/>
                </label><br></br>
                <label>
                  Balance:
                  <input type="text" name="balance" style={{marginLeft: '15px', marginBottom: '10px'}}/>
                </label><br></br>
                <label>
                  Address:
                  <input type="text" name="address" style={{marginLeft: '12px', marginBottom: '10px'}}/>
                </label><br></br>

                <button className="bg-gray-200 hover:shadow-md px-4 py-2 border-1 rounded" type="submit">Submit</button>
              </form>
            </div>
          ) : null
      }

      <button onClick={displayDialogForAddingStudents}>Add Student</button>

      <form onSubmit={retrieveStudentByAddress}>
        <div style={{textAlign: 'center'}}>
          <label className="mb-2" style={{display: 'block'}}>
          Student Address:
            <input className="block rounded p-2 border-2 focus:border-gray-400 focus:outline-none border" name="address" />
          </label>
          <button className="bg-gray-200 hover:shadow-md px-4 py-2 border-1 rounded" type="submit">Find Student</button>
        </div>
      </form>

      {
        currentStudent
          ? (
            <div>
              <p>Name: {currentStudent.name}</p>
              <p>Age: {currentStudent.age}</p>
              <p>Balance: {currentStudent.balance}</p>
              <p>Address: {currentStudent.address}</p>
            </div>
          ) : null
      }
    </main>
  );

}
