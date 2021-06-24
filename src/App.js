import React, { Component } from 'react';
import {Table, Container, Row, Col} from 'react-bootstrap';

class App extends Component {
  state = {
    bags: []
  };

  async componentDidMount() {
    try {
      const resBags = await fetch('http://localhost:8000/am_core/bags');
      const bags = await resBags.json();
      this.setState({
        bags,
      });
      console.log(this.state)
    } catch (e) {
      console.log(e);
    }
  }


  render() {
    return (
      <div>
        {this.state.bags.map(bag => (
          <Container key={bag.id}>
            <Row className="justify-content-center">
              <Col className="text-center"><h4>{bag.asset}</h4></Col>
              <Col className="text-center"><h4>Average buy price: {bag.average_price}</h4></Col>
              <Col className="text-center"><h4>Actual price: {bag.actual_price}</h4></Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {bag["orders_list"].map(order => (
                  <tr key={order.id}>
                    <td>11.06.2020</td>
                    <td>{order.order_type}</td>
                    <td>{order.amount}</td>
                    <td>{order.price}</td>
                    <td>{order.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        ))}
      </div>
    );
  }
}

export default App;