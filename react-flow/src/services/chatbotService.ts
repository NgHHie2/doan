// src/services/chatbotService.ts

interface ChatbotRequestModel {
  id: string;
  name: string;
  attributes: Array<{
    id: string;
    name: string;
    dataType: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
  }>;
}

export interface ChatbotRequest {
  diagram: {
    models: ChatbotRequestModel[];
  };
  question: string;
  history: string;
  max_new_tokens: number;
  do_sample: boolean;
}

// Response được parse từ string
export interface ChatbotResponse {
  action: "REFRESH" | "UPDATE";
  message: string;
  create: Array<{
    name: string;
    is_new: boolean;
    attrs: Array<{
      name: string;
      type: string;
      pk?: boolean;
    }>;
    fks: Array<{
      column: string;
      references: string;
    }>;
  }>;
  delete: string[];
  tomtat: string;
}

class ChatbotService {
  private readonly API_URL = "https://00d99f7eeb33.ngrok-free.app/generate";

  /**
   * Parse string response từ API thành object ChatbotResponse
   */
  parseResponse(responseString: string): ChatbotResponse {
    console.log("📥 Raw response string:", responseString);

    const response: ChatbotResponse = {
      action: "UPDATE",
      message: "",
      create: [],
      delete: [],
      tomtat: "",
    };

    try {
      // Check action type
      if (responseString.startsWith("_REFRESH:")) {
        response.action = "REFRESH";
        responseString = responseString.substring(9); // Remove "_REFRESH:"
      }

      // Extract message (text before "create:")
      const createIndex = responseString.indexOf("create:");
      if (createIndex > 0) {
        response.message = responseString.substring(0, createIndex).trim();
      }

      // Extract create array
      const createMatch = this.extractCreateArray(responseString);
      console.log(createMatch);
      if (createMatch) {
        const createJson = `[${createMatch}]`;
        response.create = JSON.parse(createJson);
        console.log("✅ Parsed create array:", response.create);
      }

      // Extract delete array
      const deleteMatch = this.extractDeleteArray(responseString);
      if (deleteMatch) {
        const deleteJson = `[${deleteMatch}]`;
        response.delete = JSON.parse(deleteJson);
        console.log("✅ Parsed delete array:", response.delete);
      }

      // Extract tomtat
      const tomtatMatch = responseString.match(/tomtat:(.*?)$/s);
      if (tomtatMatch && tomtatMatch[1]) {
        response.tomtat = tomtatMatch[1].trim();
      }
    } catch (error) {
      console.error("❌ Error parsing response:", error);
      throw new Error("Failed to parse chatbot response");
    }

    return response;
  }

  private extractCreateArray(str) {
    const start = str.indexOf("create:[");
    if (start === -1) return null;

    let i = start + "create:[".length;
    let depth = 1;

    while (i < str.length) {
      if (str[i] === "[") depth++;
      else if (str[i] === "]") depth--;

      if (depth === 0) {
        // vị trí kết thúc mảng
        return str.slice(start + "create:[".length, i);
      }

      i++;
    }

    return null; // không tìm thấy đóng
  }

  private extractDeleteArray(str) {
    const start = str.indexOf("delete:[");
    if (start === -1) return null;

    let i = start + "delete:[".length;
    let depth = 1;

    while (i < str.length) {
      if (str[i] === "[") depth++;
      else if (str[i] === "]") depth--;

      if (depth === 0) {
        // vị trí kết thúc mảng
        return str.slice(start + "delete:[".length, i);
      }

      i++;
    }

    return null; // không tìm thấy đóng
  }

  /**
   * Extract response after "### Response:" marker
   */
  private extractResponseContent(output: string): string {
    const marker = "### Response:";
    const markerIndex = output.indexOf(marker);

    if (markerIndex === -1) {
      console.warn("⚠️ Response marker not found, using full output");
      return output;
    }

    // Lấy phần sau "### Response:"
    const content = output.substring(markerIndex + marker.length).trim();
    console.log("📝 Extracted content after marker:", content);

    return content;
  }

  /**
   * Send request to chatbot API
   */
  async sendMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
    console.log("🤖 Chatbot request:", request);
    console.log("📊 Current models in diagram:", request.diagram.models);
    console.log("string req: ", JSON.stringify(request));
    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 API response:", data);

      // Extract output từ response
      if (!data.output) {
        throw new Error("No output field in API response");
      }

      // Lấy phần sau "### Response:"
      const responseContent = this.extractResponseContent(data.output);

      // Parse response string thành ChatbotResponse object
      const parsedResponse = this.parseResponse(responseContent);
      console.log("✅ Parsed response:", parsedResponse);

      return parsedResponse;
    } catch (error) {
      console.error("❌ Error calling chatbot API:", error);

      // Fallback error response
      return {
        action: "UPDATE",
        message: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
        create: [],
        delete: [],
        tomtat: "Không thể kết nối đến server AI. Vui lòng thử lại sau.",
      };
    }
  }

  // ============================================
  // MOCK DATA (COMMENTED OUT - FOR REFERENCE)
  // ============================================

  /*
  private mockResponseStrings: Record<string, string> = {
    "quản lý bán hàng": `_REFRESH:Đã tạo mới database quản lý bán hàng online gồm 6 bảng: Users (quản lý người dùng), Categories (danh mục sản phẩm), Products (sản phẩm), Orders (đơn hàng), OrderDetails (chi tiết đơn hàng), Payments (thanh toán)

create:[{"name":"Users","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"username","type":"VARCHAR"},{"name":"email","type":"VARCHAR"},{"name":"password","type":"VARCHAR"},{"name":"full_name","type":"VARCHAR"},{"name":"phone","type":"VARCHAR"},{"name":"address","type":"TEXT"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[]},{"name":"Categories","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"name","type":"VARCHAR"},{"name":"description","type":"TEXT"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[]},{"name":"Products","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"name","type":"VARCHAR"},{"name":"description","type":"TEXT"},{"name":"price","type":"DECIMAL"},{"name":"stock","type":"INT"},{"name":"category_id","type":"INT"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[{"column":"category_id","references":"Categories.id"}]},{"name":"Orders","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"user_id","type":"INT"},{"name":"total_amount","type":"DECIMAL"},{"name":"status","type":"VARCHAR"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[{"column":"user_id","references":"Users.id"}]},{"name":"OrderDetails","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"order_id","type":"INT"},{"name":"product_id","type":"INT"},{"name":"quantity","type":"INT"},{"name":"price","type":"DECIMAL"}],"fks":[{"column":"order_id","references":"Orders.id"},{"column":"product_id","references":"Products.id"}]},{"name":"Payments","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"order_id","type":"INT"},{"name":"amount","type":"DECIMAL"},{"name":"payment_method","type":"VARCHAR"},{"name":"status","type":"VARCHAR"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[{"column":"order_id","references":"Orders.id"}]}] delete:[] tomtat:Đã tạo mới database quản lý bán hàng online với 6 bảng: Users, Categories, Products, Orders, OrderDetails, Payments`,

    "thư viện": `_REFRESH:Đã tạo mới database quản lý thư viện gồm 6 bảng: Users (quản lý người dùng), Categories (danh mục sách), Authors (tác giả), Books (sách với liên kết tới Categories và Authors), BorrowRecords (phiếu mượn sách liên kết Users và Books), Fines (phạt trễ hạn liên kết với BorrowRecords)

create:[{"name":"Users","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"username","type":"VARCHAR"},{"name":"email","type":"VARCHAR"},{"name":"password","type":"VARCHAR"},{"name":"full_name","type":"VARCHAR"},{"name":"phone","type":"VARCHAR"},{"name":"role","type":"VARCHAR"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[]},{"name":"Categories","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"name","type":"VARCHAR"},{"name":"description","type":"TEXT"}],"fks":[]},{"name":"Authors","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"name","type":"VARCHAR"},{"name":"biography","type":"TEXT"},{"name":"nationality","type":"VARCHAR"}],"fks":[]},{"name":"Books","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"title","type":"VARCHAR"},{"name":"isbn","type":"VARCHAR"},{"name":"category_id","type":"INT"},{"name":"author_id","type":"INT"},{"name":"published_year","type":"INT"},{"name":"available_copies","type":"INT"}],"fks":[{"column":"category_id","references":"Categories.id"},{"column":"author_id","references":"Authors.id"}]},{"name":"BorrowRecords","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"user_id","type":"INT"},{"name":"book_id","type":"INT"},{"name":"borrow_date","type":"DATE"},{"name":"due_date","type":"DATE"},{"name":"return_date","type":"DATE"},{"name":"status","type":"VARCHAR"}],"fks":[{"column":"user_id","references":"Users.id"},{"column":"book_id","references":"Books.id"}]},{"name":"Fines","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"borrow_record_id","type":"INT"},{"name":"amount","type":"DECIMAL"},{"name":"paid","type":"BOOLEAN"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[{"column":"borrow_record_id","references":"BorrowRecords.id"}]}] delete:[] tomtat:Đã tạo mới database quản lý thư viện gồm 6 bảng: Users, Categories, Authors, Books, BorrowRecords, Fines`,

    "trường học": `_REFRESH:Đã tạo mới database quản lý trường học với 6 bảng: Users, Courses, Students, Instructors, Enrollments, Reviews

create:[{"name":"Users","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"username","type":"VARCHAR"},{"name":"email","type":"VARCHAR"},{"name":"password","type":"VARCHAR"},{"name":"phone","type":"VARCHAR"},{"name":"role","type":"VARCHAR"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[]},{"name":"Courses","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"name","type":"VARCHAR"},{"name":"description","type":"TEXT"},{"name":"category","type":"VARCHAR"},{"name":"duration","type":"INT"},{"name":"fee","type":"DECIMAL"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[]},{"name":"Students","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"full_name","type":"VARCHAR"},{"name":"email","type":"VARCHAR"},{"name":"phone","type":"VARCHAR"},{"name":"address","type":"TEXT"},{"name":"date_of_birth","type":"DATE"},{"name":"enrollment_date","type":"DATE"},{"name":"course_id","type":"INT"}],"fks":[{"column":"course_id","references":"Courses.id"}]},{"name":"Instructors","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"full_name","type":"VARCHAR"},{"name":"email","type":"VARCHAR"},{"name":"phone","type":"VARCHAR"},{"name":"biography","type":"TEXT"},{"name":"experience","type":"INT"},{"name":"course_id","type":"INT"}],"fks":[{"column":"course_id","references":"Courses.id"}]},{"name":"Enrollments","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"student_id","type":"INT"},{"name":"course_id","type":"INT"},{"name":"enrollment_date","type":"DATE"},{"name":"status","type":"VARCHAR"}],"fks":[{"column":"student_id","references":"Students.id"},{"column":"course_id","references":"Courses.id"}]},{"name":"Reviews","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"student_id","type":"INT"},{"name":"course_id","type":"INT"},{"name":"rating","type":"INT"},{"name":"comment","type":"TEXT"},{"name":"created_at","type":"TIMESTAMP"}],"fks":[{"column":"student_id","references":"Students.id"},{"column":"course_id","references":"Courses.id"}]}] delete:[] tomtat:Đã tạo mới database quản lý trường học với 5 bảng: Users, Courses, Students, Instructors, Enrollments, Reviews. Thiết lập các quan hệ khóa ngoại.`,

    "nhà xuất bản": `create:[{"name":"Publishers","is_new":true,"attrs":[{"name":"id","type":"INT","pk":true},{"name":"name","type":"VARCHAR"},{"name":"address","type":"TEXT"},{"name":"phone","type":"VARCHAR"},{"name":"email","type":"VARCHAR"}],"fks":[]},{"name":"Books","is_new":false,"attrs":[{"name":"publisher_id","type":"INT"}],"fks":[{"column":"publisher_id","references":"Publishers.id"}]}] delete:[] tomtat:Đã thêm bảng Publishers (nhà xuất bản) với các thuộc tính id, name, address, phone, email. Đã thêm cột publisher_id vào bảng Books và tạo khóa ngoại liên kết với Publishers.id`,
  };

  // Mock version of sendMessage (commented out)
  async sendMessageMock(request: ChatbotRequest): Promise<ChatbotResponse> {
    console.log("🤖 Chatbot request:", request);
    console.log("📊 Current models in diagram:", request.diagram.models);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Find matching mock response
    const question = request.question.toLowerCase();
    let responseString = "";

    for (const [keyword, mockResponse] of Object.entries(
      this.mockResponseStrings
    )) {
      if (question.includes(keyword)) {
        responseString = mockResponse;
        break;
      }
    }

    // Default response if no match
    if (!responseString) {
      responseString = `_REFRESH:Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Hãy thử hỏi về "quản lý bán hàng", "thư viện", hoặc "trường học".

create:[] delete:[] tomtat:Không có thay đổi nào được thực hiện.`;
    }

    const parsedResponse = this.parseResponse(responseString);
    console.log("✅ Parsed response:", parsedResponse);

    return parsedResponse;
  }
  */
}

export const chatbotService = new ChatbotService();
