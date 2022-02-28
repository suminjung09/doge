import React, { useState, useEffect} from "react";
import Amplify, {API, graphqlOperation} from "aws-amplify"
import awsExports from './aws-exports'

import { updateDoge } from './graphql/mutations'
import { getDoge } from "./graphql/queries";

import './App.css';

Amplify.configure(awsExports);

function App() {

    const [dogePrice, setDogePrice] =  useState(0);

    async function fetchDogePrice() {
        try {
            const dogeData = await API.graphql(graphqlOperation(getDoge));
            const dogePrice = dogeData.data.getDoge.price;
            setDogePrice(dogePrice)
        } catch (e) {
            console.log('error fetching doge price', e)
        }
    }

    async function updateDogePrice() {
        try {
            const dogeData = await API.graphql(graphqlOperation(getDoge));
            const dogePrice = dogeData.data.getDoge.price + 0.1;

            const updatedDogePrice = await API.graphql(graphqlOperation(updateDoge, {input: dogePrice}));
            setDogePrice(updatedDogePrice.data.updateDoge.price);    
        } catch (e) {
            console.log("update doge failed", e);
        }
    }


    useEffect(() => {
        fetchDogePrice()
    }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dogecoin price predictor</h1>
        <p>One click = 10 cents</p>
          <h2>{dogePrice.toFixed(2)}</h2>
          <button onClick={updateDogePrice}>Doge</button>


      </header>
    </div>
  );
}

export default App;
