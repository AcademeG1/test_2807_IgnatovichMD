const container = document.getElementById('container');
const form = document.getElementById('form');
const blockSizeInput = document.getElementById('blockSize');
let id = 1;
let allWidth = 0;

function handleFormSubmit(event) {
  event.preventDefault();
  const blockSize = parseInt(blockSizeInput.value);
  if (!isNaN(blockSize) && blockSize > 0) {
    createBlock(blockSize);
    blockSizeInput.value = '';
  }
}

form.addEventListener('submit', handleFormSubmit);

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createBlock(blockSize, colors, ids) {
    if (allWidth > window.innerWidth - 20) {
        alert('нет места');
        return;
    }
    const block = document.createElement('div');
    block.className = 'block';
    if (ids !== undefined) {
        block.id = ids;
    } else {
        block.id = id;
        id++;
    }
    block.style.marginLeft = '0px';
    block.style.width = blockSize + 'px';
    allWidth += blockSize;
    if (colors !== undefined) {
        block.style.backgroundColor = colors;
    } else block.style.backgroundColor = getRandomColor();
    
    block.addEventListener('dblclick', handleBlockDoubleClick);
    block.addEventListener('click', handleBlockClick);

    addBlock(block);
}

function handleBlockDoubleClick(event) {
  if (event.target == container.lastChild) {
    event.target.remove();
  } else {
    const nextElement = event.target.nextElementSibling;
    const currentMargin = parseInt(nextElement.style.marginLeft);
    nextElement.style.marginLeft = `${(parseInt(event.target.style.marginLeft) + parseInt(event.target.style.width) + currentMargin)}px`;
    event.target.remove();
  }
  allWidth -= parseInt(event.target.style.width);
}

function handleBlockClick(event) {
  const children = Array.from(container.children);
  const elementId = event.target.id;
  children.forEach(item => {
    if (item.id == elementId) {
      item.classList.toggle('lighting');
    }
  });
}

function addBlock(block) {
    const children = Array.from(container.children);
    if (children.length == 0) {
        container.append(block);
    } else {
        const [left] = children.filter(item => item.style.marginLeft !== '0px');
        if (!left) {
            container.append(block);
        } else {
            const marg = parseInt(left.style.marginLeft, 10);
            if (blockSizeInput.value <= marg) {
                left.before(block);
                const blockWidth = parseInt(block.style.width);
                left.style.marginLeft = `${(parseInt(left.style.marginLeft) - blockWidth) < 0 ? '0px' : (parseInt(left.style.marginLeft) - blockWidth)}px`;
            } else {
                const lastWidth = parseInt(block.style.width) - marg;
                block.style.width = marg + 'px';
                left.before(block);
                left.style.marginLeft = '0px';
                createBlock(lastWidth, block.style.backgroundColor, block.id)
            }
        }
    }
}
