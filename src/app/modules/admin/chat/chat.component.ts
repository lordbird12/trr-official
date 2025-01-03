import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChatService } from './chat.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NewChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer: ElementRef | undefined;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  env: any;
  messages: any;
  chat_msgs: any[] = [];
  member: any[] = [];
  newMessage: string = '';
  selectedChatId: number | null = null;
  uploadProgress: number = 0;
  private intervalId: any;
  userdata: any;

  member2: any[] = []; // รายชื่อผู้ติดต่อ
  searchTerm: string = ''; // คำค้นหา
  selectedChatId2: number | null = null; // ID ของการแชทที่เลือก


  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) {
    this.userdata = JSON.parse(localStorage.getItem('user'))
  }


  ngOnInit(): void {
    this.fetchMembers('');
    // ตัวอย่างข้อมูล (ดึงข้อมูลจริงจาก API หรือ Service)
    // this.member2 = [
    //   { id: 1, name: 'John Doe', image: null, noti: 2, meeting: 0 },
    //   { id: 2, name: 'Jane Smith', image: null, noti: 0, meeting: 1 },
    //   { id: 3, name: null, image: '{}', noti: 5, meeting: 0 },
    //   // เพิ่มข้อมูลตามต้องการ
    // ];

    this.env = environment.baseURL + '/'
    console.log(this.env)
    this.getMessages();
    this.intervalId = setInterval(() => {
      this.checkNewMessages();
    }, 5000);
  }

  fetchMembers(search: string): void {
    this.chatService.getMembers(search).subscribe(
      (response) => {
        if (response?.result === 1) {
          this.member2 = response.data.map((item: any) => ({
            id: item.Quota_id,
            name: `${item.First_name} ${item.Last_name}`,
            phone: item.phone_number,
            image: null, // Set a default or fetch from elsewhere if available
            noti: 0, // Default notification count
          }));
        }
      },
      (error) => {
        console.error('Error fetching members:', error);
      }
    );
  }

  // ฟังก์ชันกรองรายชื่อ
  filteredMembers() {
    if (!this.searchTerm.trim()) {
      return []; // Return an empty array when no search term
    }

    return this.member2.filter((m) =>
      m.name
        ? m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : m.id.toString().includes(this.searchTerm)
    );
  }

  selectContact2(contactId: number, name: string): void {
    this.searchTerm = ''; // Clear the search term to reset filteredMembers()
    this.selectedChatId2 = contactId;
    this.chatService.createChat(contactId, name).subscribe(() => {
      this.getMessages();
    });

    const selectedChat = this.member.find(contact => contact.id === contactId);

    if (selectedChat) {
      // Destructure the selected chat data
      const { name, id, chat_msgs } = selectedChat;
      this.name = name;
      this.iduser = id;
      this.chat_msgs = chat_msgs;

      // Scroll to bottom and trigger change detection
      setTimeout(() => this.scrollToBottom(), 100);
      this.cdr.detectChanges();
    }
  }



  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  getFileName(filePath: string): string {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel';
      case 'ppt':
      case 'pptx':
        return 'pi pi-file-powerpoint';
      case 'zip':
      case 'rar':
        return 'pi pi-file-archive';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'pi pi-file-image';
      case 'txt':
        return 'pi pi-file';
      default:
        return 'pi pi-file';
    }
  }

  getMessages() {
    this.chatService.getMessages().subscribe((resp: any) => {
      this.messages = resp;
      console.log(resp);
      this.member = resp.data.data.map((chat: any) => ({
        id: chat?.id,
        name: chat?.frammer?.name ?? "Guest",
        meeting: chat?.meeting ?? "-",
        image: chat?.frammer?.image,
        chat_msgs: chat?.chat_msgs ?? "-",
        noti: chat?.noti ?? "-"
      }));

      if (this.selectedChatId !== null) {
        const selectedChat = this.member.find(contact => contact?.id === this.selectedChatId);
        if (selectedChat) {
          this.chat_msgs = selectedChat.chat_msgs;
        }
      }

      // this.scrollToBottom();
      this.cdr.detectChanges();
    });
  }

  checkNewMessages() {
    this.getMessages();
  }
  uploadfile() {
    console.log(this.fileInput)
  }
  name: string;
  iduser: any;
  selectContact(contactId: number): void {
    this.chatService.updateChatStatus(contactId).subscribe();

    // Update the selected chat details
    this.selectedChatId = contactId;

    const selectedChat = this.member.find(contact => contact.id === contactId);

    if (selectedChat) {
      // Destructure the selected chat data
      const { name, id, chat_msgs } = selectedChat;
      this.name = name;
      this.iduser = id;
      this.chat_msgs = chat_msgs;

      // Scroll to bottom and trigger change detection
      setTimeout(() => this.scrollToBottom(), 100);
      this.cdr.detectChanges();
    }
  }


  sendMessage() {
    if (this.newMessage.trim().length === 0 || this.selectedChatId === null) {
      return;
    }

    this.sendMessageWithFile(this.newMessage, 'text');
    this.newMessage = ''; // Clear the input field after sending the message
    setTimeout(() => this.scrollToBottom(), 100); // Scroll to bottom after sending the message
  }

  sendMessageWithFile(filePath: string, type: string) {
    console.log(filePath);

    if (this.selectedChatId === null) return;
    this.chatService.sendMessages(this.selectedChatId, filePath, this.userdata?.id, type).subscribe((resp: any) => {
      const newMessageData = {
        id: resp?.data?.id,
        message: filePath,
        user_id: this.userdata?.id,
        member_id: null,
        type: type
      };

      this.chat_msgs.push(newMessageData);
      this.newMessage = '';
      setTimeout(() => this.scrollToBottom(), 100);
      this.cdr.detectChanges();

      console.log('File uploaded and added to chat:', filePath);
    });
  }

  onFileSelected(event: any) {
    console.log(event)
    if (this.selectedChatId === null) {
      console.log('No selected chat, file upload aborted.');
      return;
    }

    const file: File = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        console.log('Uploading image file:', file?.name);
        this.chatService.uploadImage(this.selectedChatId, file).subscribe((event: HttpEvent<any>) => {
          this.handleUploadEvent(event, 'image');
          console.log('Image upload completed.');
          console.log(event, 'eventimage');
        });
      } else {
        console.log('Uploading file:', file?.name);
        this.chatService.uploadFile(this.selectedChatId, file).subscribe((event: HttpEvent<any>) => {
          this.handleUploadEvent(event, 'file');
          console.log('File upload completed.');
        });
      }
    } else {
      console.log('No file selected.');
    }
  }


  handleUploadEvent(event: any, type: string) {
    console.log(event, 'path')
    console.log(type, 'type')
    this.sendMessageWithFile(event.data, type);
    // switch (event.type) {
    //   case HttpEventType.UploadProgress:
    //     if (event.total) {
    //       this.uploadProgress = Math.round((100 * event.loaded) / event.total);
    //     }
    //     break;
    //   case HttpEventType.Response:
    //     let filePath = '';

    //     if (event.body.data.fileName.startsWith('image/')) {
    //       type = 'image';
    //       filePath = `/images/asset_chat_smg/${event.body.data.fileName}`;
    //     } else {
    //       type = 'file';
    //       filePath = `/files/asset_chat_smg/${event.body.data.fileName}`;
    //     }
    //     console.log(filePath,'path')

    //     console.log('File uploaded and added to chat:', filePath);
    //     break;
    // }
  }





  scrollToBottom(): void {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll to bottom failed:', err);
      }
    }
  }

  deleteMessage(index: number): void {
    if (confirm('Are you sure you want to delete this message?')) {
      const message = this.chat_msgs[index];
      this.chatService.deleteMessage(message.id).subscribe(() => {
        this.chat_msgs.splice(index, 1);
        this.cdr.detectChanges();
      });
    }
  }

  onRightClick(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.deleteMessage(index);
  }
}
