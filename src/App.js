import React, { Component } from 'react';
import './App.css';

import { API, graphqlOperation } from 'aws-amplify'
import { listPrinters } from './graphql/queries.js'
import { createPrinter, deletePrinter, updatePrinter } from './graphql/mutations'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      printers: [],
      createName: '',
      createIp: '',
      createStatus: true,
      updateName: '',
      updateIp: '',
      updateStatus: true,
      selectedId: ''
    };
  }

  async componentDidMount() {
    try {
      const apiData = await API.graphql(graphqlOperation(listPrinters));
      const printers = apiData.data.listPrinters.items;
      this.setState({ printers, selectedId: printers[0].id });
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  readPrinters = async () => {
    try {
      const apiData = await API.graphql(graphqlOperation(listPrinters));
      const printers = apiData.data.listPrinters.items;
      this.setState({ printers });
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  createPrinter = async () => {
    const { createName, createIp, createStatus } = this.state
    if (createName === '' || createIp === '') return
    let name = createName;
    let ip = createIp;
    let status = createStatus;
    try {
      const printer = { name, ip, status };
      const printers = [...this.state.printers, printer];
      await API.graphql(graphqlOperation(createPrinter, {input: printer}));
      this.setState({ printers, createName: '', createIp: '', createStatus: true});
      console.log('printer successfully created!');
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  updatePrinter = async () => {
    console.log(this.state); 
    const { selectedId, updateName, updateIp, updateStatus } = this.state
    let id = selectedId;
    let name = updateName;
    let ip = updateIp;
    let status = updateStatus;
    try {
      const printer = { id, name, ip, status };
      await API.graphql(graphqlOperation(updatePrinter, {input: printer}));
     this.readPrinters();
     this.setState({ updateName: '', updateIp: '', updateStatus: true});
      console.log('printer successfully updated!')
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  deletePrinter = async (e) => {
    try {
      const id = {"id": e.target.value};
      await API.graphql(graphqlOperation(deletePrinter, {input: id}));
      this.readPrinters();
      console.log('printer successfully deleted!')
    } catch (e) {
      console.log('Error: ', e)
    }
  }

  onChange = e => {

    let name = e.target.name;
    let value = e.target.value;

    console.log(value);

    if(value === "true") value = true;
    if(value === "false") value = false;
    
    this.setState({ [name]: value })
  }

  render() {
    return (
      <div className="App">
        <div className="d-flex flex-row justify-content-center mt-3 mb-2">

          <div className="col-md-8">
            <h1 className="text-center">Printers</h1>
              <div className="form-group mb-3">
                <select className="form-control" name="selectedId" onChange={this.onChange}>
                {
                  this.state.printers.map((printer, i) => (
                    <option key={i} value={printer.id}>{printer.name}</option>         
                  ))
                }
                </select>
              </div>

              <div className="form-group mb-3">
                <div className="form-row">
                  <div className="col">
                    <input 
                     type="text" 
                     className="form-control" 
                     name="updateName"
                     placeholder="Name"
                     onChange={this.onChange}
                     value={this.state.updateName}
                    />
                  </div>
                  <div className="col">
                  <input 
                     type="text" 
                     className="form-control" 
                     name="updateIp"
                     placeholder="IP"
                     onChange={this.onChange}
                     value={this.state.updateIp}
                    />
                  </div>
                  <div className="col">
                    <select className="form-control" name="updateStatus" onChange={this.onChange}>
                      <option value="true">Active</option>    
                      <option value="false">Inactive</option>     
                    </select>
                  </div>
                  <div className="col">
                    <button className="btn btn-primary" onClick={this.updatePrinter}>
                      Edit Printer
                    </button>
                  </div> 
                </div>
              </div>

            <table className="table table-striped">
                <thead>
                <th width="30%">Name</th>
                <th width="30%">IP</th>
                <th width="30%">Status</th>
                <th className="text-right" width="10%"></th>
                </thead>
                <tbody>
                {
                  this.state.printers.map((printer, i) => (
                    <tr key={i}>
                      <td>
                          {printer.name}
                      </td>
                      <td>
                          {printer.ip}
                      </td>
                      <td>
                          <span style={{color: printer.status ? "green" : "red"}}>
                            {printer.status ? "Active" : "Inactive"}
                          </span>                  
                      </td>
                      <td className="text-right">
                          <button className="btn btn-sm btn-danger" value={printer.id} onClick={this.deletePrinter}>
                            Delete
                          </button>
                      </td>
                    </tr>
                  ))
                }
                </tbody>
            </table>
           
                <div className="form-row">
                  <div className="col">
                    <input 
                     type="text" 
                     className="form-control" 
                     name="createName"
                     placeholder="Name"
                     onChange={this.onChange}
                     value={this.state.createName}
                    />
                  </div>
                  <div className="col">
                  <input 
                     type="text" 
                     className="form-control" 
                     name="createIp"
                     placeholder="IP"
                     onChange={this.onChange}
                     value={this.state.createIp}
                    />
                  </div>
                  <div className="col">
                    <select className="form-control" name="createStatus">
                      <option value="true">Active</option>    
                      <option value="false">Inactive</option>     
                    </select>
                  </div>
                  <div className="col">
                    <button className="btn btn-primary" onClick={this.createPrinter}>
                      Add Printer
                    </button>
                  </div> 
                </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App
