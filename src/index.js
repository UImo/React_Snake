import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Class Snake
// - Snake movements
// - controlls

// Board
// - borders
// - contains the grid
// - will host the snake and the apple

class Board extends React.Component {
    WIDTH = 11;
    HEIGHT = 11;
    itemWidth = 100/this.WIDTH;
    itemHeight = 100/this.HEIGHT;
    constructor(props){
        super(props);
        this.state = {
            tickTime: 200,
            paused : true,
            width: this.WIDTH,
            height: this.HEIGHT,
            hightScore: 0,
            gameOver: false,
            grid: this.initGrid(this.HEIGHT, this.WIDTH),
            food: this.getRandom(this.HEIGHT, this.WIDTH),
            direction:'up',
            snake: {
                head: this.getCenterOfGrid(),
                body: [],
                length: 0
            }
        };

        //this.initGrid();
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentDidMount(){
        document.body.addEventListener('keydown', this.handleKeyPress);
        
    }

    componentWillUnmount(){
        document.body.removeEventListener('keydown', this.handleKeyPress);
        clearInterval(window.fnInterval);
    }


    initGrid(height,width){

        const matrix = [];
        for(let row=0; row < height; row++){
            for(let col=0; col < width; col++){
                matrix.push({
                    row,
                    col,
                    status:0,        // 0:empty 1:wall 2:food 3:snake 4:head
                    isFood: false,
                    isHead: false,
                    isBody: false,
                    //isBody: false
                })
            }
        };
        // const matrix = new Array(this.state.height).fill(0).map(() => new Array(this.state.width).fill(0));
        //this.setState({grid: matrix,})
        return matrix;
    }

    restart = () => {
        this.setState((state)=>{
            //if(state.snake.length > state.hightScore) state.hightScore = state.snake.length;
            if(!state.paused) this.pausePlay();
            return {
                ...state,
                hightScore: state.snake.length > state.hightScore ? state.snake.length : state.hightScore,
                grid: this.initGrid(this.HEIGHT, this.WIDTH),
                food: this.getRandom(this.HEIGHT, this.WIDTH),
                gameOver: false,
                direction:'up',
                snake: {
                    head: this.getCenterOfGrid(),
                    body: [],
                    length: 0
                }
            }
        })
    }

    // Behaviors

    getRandom(){
        return {
            row: Math.floor(Math.random() * this.HEIGHT),
            col: Math.floor(Math.random() * this.WIDTH)
        }
    }

    getCenterOfGrid() {
        return {
            row: Math.floor((this.HEIGHT) / 2),
            col: Math.floor((this.WIDTH) / 2),
        }
    }

    setTick(){
        window.fnInterval = setInterval(() => {
            this.gameTick();
        }, this.state.tickTime);
    }

    /*setPlay(){
        this.setState({ paused : false });
        this.setTick();
    }

    setPause() {
        this.setState({ paused : true });
        clearInterval(window.fnInterval);
    }*/

    pausePlay(){
        if(this.state.paused){
            this.setState({ paused : false });
            this.setTick();
        }
        else{
            this.setState({ paused : true });
            clearInterval(window.fnInterval);
        }
    }

    // --- FOOD ---
    foodHandler(){
        // add del food if more than one food
        function isIn(body, food){
            for(let i=0; i<body.length; i++){
                if(body[i].row === food.row && body[i].col === food.col) return true;
            }
            return false;
        }

        let food = this.getRandom();
        const {body} = this.state.snake;
        while(isIn(body,food)) {
            food = this.getRandom();
        }
        return food;
    }

    // for rendering function
    checkIfFood(grid){
        const isFood = (this.state.food.row === grid.row && this.state.food.col === grid.col);
        grid.isFood = isFood;
        // return isFood;
    }

    // --- ---

    // --- SNAKE ---
    // - Head -
    
    checkIfHead(grid){
        const isHead = (this.state.snake.head.row === grid.row && this.state.snake.head.col === grid.col);
        grid.isHead = isHead;
        // return isFood;
    }

    checkIfBody(grid){
        let isBody = false;
        for(let i=0; i<this.state.snake.body.length; i++){
            isBody = (this.state.snake.body[i].row === grid.row && this.state.snake.body[i].col === grid.col);
            if(isBody) break;
        }
        //const isBody = (this.state.snake.head.row === grid.row && this.state.snake.head.col === grid.col);
        grid.isBody = isBody;
        // return isFood;
    }

    // NOT USED
    moveSnake(direction, snake){
        let {head, body} = snake;
        const {
            row,
            col
        } = head;

        let oldHead = {
            row,
            col
        };
        //const oldHead = snake.head;
        
        switch (direction) {
            case 'left':
                head.col--;
                break;
            case 'up':
                head.row--;
                break;
            case 'down':
                head.row++;
                break;
            case 'right':
                default:
                    head.col++;
                    break;
        };
        body.unshift(oldHead);
        body.pop(snake.body[snake.body.length-1])
        return {...snake,
            head,
            body
        };
    }

    growSnake(snake){
        snake.length += 1;
        const tail = snake.body.length === 0 ? snake.head : snake.body[snake.body.length-1];
        snake.body.push(tail);
        return snake;
    }

    checkGameOver(snake){
        // snake head
        // maybe score (length) if the snake can't get any bigger
        // snake body
        // limits
        // later walls if they're added
        let isGameOver = false
        const {head, body} = snake;
        const {row,col} = head;
        if(row < 0 || row >= this.HEIGHT || col < 0 || col >= this.WIDTH) isGameOver = true;
        // else if(body.includes(head)) isGameOver = true;
        for(let i=0; i<body.length; i++){
            if(body[i].row === row && body[i].col === col) isGameOver = true;
        }
        return isGameOver;
    }

    handleKeyPress(key){
        this.setState((state) => {
            let {direction, oldDirection} = this.state;
            switch (key.keyCode) {
                case 37:
                    if(oldDirection !== 'right') direction = 'left';
                    break;
                case 38:
                    default:
                        if(oldDirection !== 'down') direction = 'up';
                        break;
                case 39:
                    if(oldDirection !== 'left') direction = 'right';
                    break;
                case 40:
                    if(oldDirection !== 'up') direction = 'down';
                    break;
                case 32:
                    //state.paused ? this.setPlay(): this.setPause();
                    key.preventDefault()
                    if(!this.state.gameOver) this.pausePlay()
                    break
            }
            return {
                ...state,
                direction
            };
        });
        
    }

    // ---
    gameTick() {
        this.setState((state) => {
            let {
                direction,
                gameOver,
                snake,
                food
            } = state;

            // if(gameOver) this.pausePlay();
            
            if(!gameOver){
                
                
                /*let {
                    tail
                } = snake;*/
                
                // Move snake's head
                snake = this.moveSnake(direction, snake);
                this.setState({oldDirection: direction});

                // if head on food
                if(snake.head.row === food.row && snake.head.col === food.col) {
                    food = this.foodHandler();
                    snake = this.growSnake(snake)
                }
                else gameOver = this.checkGameOver(snake);
                
            }

            return {
                ...state,
                gameOver,
                food,
                snake: snake
            }

            /*const newState = {
                ...state,
                food,
                snake: {
                  head
                }
            };*/
        })
    }


    renderSquare(grid){
        this.checkIfFood(grid); // function can be replaced || Two options either bool or set
        this.checkIfHead(grid);
        this.checkIfBody(grid);
        
        let className = 'grid-item';
        if (grid.isFood){className += ' is-food'}
        if (grid.isHead){className += ' is-head'}
        if (grid.isBody){className += ' is-body'}
        if (this.state.gameOver){className += ' is-gameOver'}
        //if (grid.isFood && grid.isHead){this.foodHandler()} // Checked in gametick
        return (
        <div className = {className}
            key = { grid.row.toString()+'-'+grid.col.toString() } 
            style = {{width : this.itemWidth.toString()+'%',
                    height : this.itemHeight.toString()+'%'}} >
            {}
        </div>);
    }

    render(){
        //const food = this.getRandomGrid();
        const gridItems = this.state.grid.map((gridItem) => this.renderSquare(gridItem));
        
        return(
        <div>
        <div className="snake-container">
            <div className="grid">
                {gridItems}
            </div>
            <div className= "game-info">
                <h2 className="score">Score: {this.state.snake.length.toString()}</h2>
                <h4>Highscore: {this.state.hightScore.toString()}</h4>
                <div className="pause">{this.state.paused ? "Paused - Space to play": this.state.gameOver ? "Game Over" : "Space to pause"}</div>
                <button className="restart" onClick={this.restart}><img className="icon" src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_update-512.png" alt="re-start"/></button>
                
            </div>
        </div>
        </div>);
    }
}


class Game extends React.Component {
    render() {
        return (
            <div className = 'game'>
                <header>
                    <h1 className="title">Snake</h1>
                </header>
                <div className="game-board">
                    <Board />
                </div>
                <footer><span className="name">by Mathis Powell</span></footer>
            </div>
        )
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
