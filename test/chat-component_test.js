import assert from 'assert';
import TestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import Chat from '../src/components/chat';

describe('chat component', () => {

  it('should be sane', () => {
    assert.equal(true, !false);
  });

  it('should display sent message', () => {
    const chat = TestUtils.renderIntoDocument(Chat);
    var e = new KeyboardEvent('keyup', {
        keyCode: 13
    });
    document
        .querySelector('.input')
        .dispatchEvent(e)
  });
});
