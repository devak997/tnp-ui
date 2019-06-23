import React from 'react';

const RoundFormDisplay = () => {
    return(
        <div>
            <h4 className="ui dividing header">Select Rounds</h4>
          <div
            className={`${
              // @ts-ignore
              this.state.noOfRounds === ""
                ? ""
                : converter.toWords(this.state.noOfRounds)
            } wide fields`}
          >
            {this.displaySelectRounds()}
          </div>
        </div>
    );
}