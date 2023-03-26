"use strict";
class Entry{
    constructor(name,number,email){
        this.name=name;
        this.number=number;
        this.email=email;
    }
    delete(){
        let index=entries.indexOf(this);
        entries.splice(index,1);
        renderEntries();
        document.getElementById('confirmation-container').style.display='none';
    }
}
 let entries=[new Entry('Olga Bolga','80423082','olgabolga@gmail.com'),new Entry('Bella Bob','234235352','bellb43@yahoo.com'),new Entry('Olsen Banden','283482342','olsenb@email.com')];
 function renderEntries(){
    let list=document.getElementById('list');
    list.innerHTML='';
    let searchTerm=document.getElementById('search').value.toLowerCase();
    let searchEntries=[];
    /* searching */
    for (let entry of entries){
        if (entry.name.toLowerCase().includes(searchTerm) || entry.number.toLowerCase().includes(searchTerm) || entry.email.toLowerCase().includes(searchTerm)){
            searchEntries.push(entry);
        }
    }
    let sortOption=document.getElementById('sortSelect').value;
    
    if (sortOption==='name'){
        sortName(searchEntries);
    }else if(sortOption==='tel'){
        sortNumber(searchEntries);
    }else if(sortOption==='email'){
        sortEmail(searchEntries);
    }
    /* showing */
    for (let entry of searchEntries){
        let li=document.createElement('li');
        list.appendChild(li);
        let h3=document.createElement('h3');
        h3.textContent=entry.name;
        li.appendChild(h3);
        let p=document.createElement('p');
        p.textContent=entry.number;
        li.appendChild(p);
        let a=document.createElement('a');
        a.textContent=entry.email;
        a.href='mailto:'+entry.email;
        li.appendChild(a);
        let del=document.createElement('button');
        del.className='delete material-symbols-outlined';
        del.textContent='delete';
        del.addEventListener('click',function(){confirmDel(entry);});
        li.appendChild(del);
        let edit=document.createElement('button');
        edit.className='edit material-symbols-outlined';
        edit.textContent='edit_square';
        edit.addEventListener('click',function(){showEdit(entry);});
        li.appendChild(edit);
    }
 }
function cancelDel(){
    // removes all eventlisteners
    let oldButton = document.getElementById('yes-button');
    let newButton = oldButton.cloneNode(true);
    oldButton.parentNode.replaceChild(newButton, oldButton);
    
    document.getElementById('confirmation-container').style.display='none';
}
function confirmDel(entry){
    document.getElementById('confirmation-container').style.display='flex';
    document.getElementById('yes-button').addEventListener('click',function(){entry.delete();},{ once:true});
}
function showAddEntry(){
    if (document.getElementById('edit-container').style.display!=='none'){
        cancelEdit();
    }
        document.getElementById('name-error').style.display='none';
        document.getElementById('tel-error').style.display='none';
        document.getElementById('email-error').style.display='none';
        document.getElementById('tel-email-error').style.display='none';
        document.getElementById('add-container').style.display='flex';
}
function cancelAdd(){
    document.getElementById('add-container').style.display='none';
    document.getElementById('name').value='';
    document.getElementById('tel').value='';
    document.getElementById('email').value='';
}
function addEntry(){
    if (nameCheck()&&emailTelCheck()&&emailCheck()&&telCheck()){
        entries.push(new Entry(document.getElementById('name').value,document.getElementById('tel').value,document.getElementById('email').value));
        document.getElementById('add-container').style.display='none';
        renderEntries();
        document.getElementById('name').value='';
        document.getElementById('tel').value='';
        document.getElementById('email').value='';
    }else{
        nameCheck();
        emailTelCheck();
    }
}
function nameCheck(){
    let input=document.getElementById('name').value.trim();
    if (input!==''){
        document.getElementById('name-error').style.display='none';
        return true;
    }else{
        document.getElementById('name-error').style.display='block';
        return false;
    }
}
function emailTelCheck(){
    let telInput=document.getElementById('tel').value.trim();
    let emailInput=document.getElementById('email').value.trim();
    if (telInput ===''&& emailInput===''){
        document.getElementById('tel-email-error').style.display='block';
        document.getElementById('email-error').style.display='none';
        document.getElementById('tel-error').style.display='none';
        return false;
    }else{
        document.getElementById('tel-email-error').style.display='none';
        return true;
    }
}
function emailCheck(){
    let emailInput=document.getElementById('email').value.trim();
    if(emailInput!==''){
        let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (emailInput.match(validEmailRegex)){
            document.getElementById('email-error').style.display='none';
            return true;
        }else{
            document.getElementById('email-error').style.display='block';
            return false;
        }
    }else{
        document.getElementById('email-error').style.display='none';
        return true;
    }
}
function telCheck(){
    let telInput=document.getElementById('tel').value.trim();
    if (telInput!==''){
        let validTelRegex=/^[\d\s+\-()]+$/;
        if (telInput.match(validTelRegex)){
            document.getElementById('tel-error').style.display='none';
            return true;
        }else{
            document.getElementById('tel-error').style.display='block';
            return false;
        }
    }else{
        document.getElementById('tel-error').style.display='none';
        return true;
    }
}
function showEdit(element){
    let oldButton = document.getElementById('edit-button');
    let newButton = oldButton.cloneNode(true);
    oldButton.parentNode.replaceChild(newButton, oldButton);
    if (document.getElementById('add-container').style.display!=='none'){
        cancelAdd();
    }
        let name=element.name;
        let tel=element.number;
        let email=element.email;
        document.getElementById('edit-name').value=name;
        document.getElementById('edit-tel').value=tel;
        document.getElementById('edit-email').value=email;
        document.getElementById('edit-container').style.display='flex';
        document.getElementById('edit-name-error').style.display='none';
        document.getElementById('edit-tel-error').style.display='none';
        document.getElementById('edit-email-error').style.display='none';
        document.getElementById('edit-tel-email-error').style.display='none';
        document.getElementById('edit-button').addEventListener('click',function(){edit(element)});
}
function edit(element){
    if (editEmailCheck()&&editTelCheck()&&editEmailTelCheck()&&editNameCheck()){
        let name=document.getElementById('edit-name').value;
        let tel=document.getElementById('edit-tel').value;
        let email=document.getElementById('edit-email').value;
        let index=entries.indexOf(element);
        entries[index]=new Entry(name,tel,email);
        renderEntries();
        document.getElementById('edit-container').style.display='none';
    }
}
function editEmailTelCheck(){
    let telInput=document.getElementById('edit-tel').value.trim();
    let emailInput=document.getElementById('edit-email').value.trim();
    if (telInput ===''&& emailInput===''){
        document.getElementById('edit-tel-email-error').style.display='block';
        document.getElementById('edit-email-error').style.display='none';
        document.getElementById('edit-tel-error').style.display='none';
        return false;
    }else{
        document.getElementById('edit-tel-email-error').style.display='none';
        return true;
    }
}
function editEmailCheck(){
    let emailInput=document.getElementById('edit-email').value.trim();
    if(emailInput!==''){
        let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (emailInput.match(validEmailRegex)){
            document.getElementById('edit-email-error').style.display='none';
            return true;
        }else{
            document.getElementById('edit-email-error').style.display='block';
            return false;
        }
    }else{
        document.getElementById('edit-email-error').style.display='none';
        return true;
    }
}
function editTelCheck(){
    let telInput=document.getElementById('edit-tel').value.trim();
    if (telInput!==''){
        let validTelRegex=/^[\d\s+\-()]+$/;
        if (telInput.match(validTelRegex)){
            document.getElementById('edit-tel-error').style.display='none';
            return true;
        }else{
            document.getElementById('edit-tel-error').style.display='block';
            return false;
        }
    }else{
        document.getElementById('edit-tel-error').style.display='none';
        return true;
    }
}
function editNameCheck(){
    let input=document.getElementById('edit-name').value.trim();
    if (input!==''){
        document.getElementById('edit-name-error').style.display='none';
        return true;
    }else{
        document.getElementById('edit-name-error').style.display='block';
        return false;
    }
}
function cancelEdit(){
        document.getElementById('edit-name').value='';
        document.getElementById('edit-tel').value='';
        document.getElementById('edit-email').value='';
        document.getElementById('edit-container').style.display='none';
}
function sortName(array){
    array.sort((a, b) => a.name.localeCompare(b.name));
}
function sortNumber(array){
    array.sort((a, b) => a.number.localeCompare(b.number));
}
function sortEmail(array){
    array.sort((a, b) => a.email.localeCompare(b.email));
}