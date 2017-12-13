import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

export const TicketListItem = ({ ticket, onItemClick }) =>
    <Menu.Item name={ticket.number} active={ticket.isActive} onClick={(e) => onItemClick(e)}>
        <Label>{ticket.messagesCount}</Label>
        № {ticket.number}
    </Menu.Item>

const TicketsList = ({ tickets }) =>
    <Menu vertical>
        <Menu.Item>
            <Input icon='search' placeholder='Искать заявку..' />
        </Menu.Item>
        {tickets.map(ticket => <TicketListItem ticket={ticket} />)}
    </Menu>

export default TicketsList;
