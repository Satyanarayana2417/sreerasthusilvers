import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUserOrders, Order, cancelOrder, requestReturn } from '@/services/orderService';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '@/assets/logo-new.png';
import {
  Loader2,
  Package,
  ArrowLeft,
  Truck,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Home,
  User,
  Share2,
  MessageCircle,
  ChevronRight,
  Ban,
  Mail,
  Copy,
  X,
  Download,
  RotateCcw as ReturnIcon,
  AlertCircle,
} from 'lucide-react';

const MobileOrders = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [selectedOrderTab, setSelectedOrderTab] = useState('current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Cancel/Return modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [customReturnReason, setCustomReturnReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to user orders
  useEffect(() => {
    if (!user) return;

    console.log('Setting up order subscription for user:', user.uid);
    setOrdersLoading(true);
    
    const unsubscribe = subscribeToUserOrders(
      user.uid,
      (fetchedOrders) => {
        console.log('📦 [MobileOrders] Real-time update received!');
        console.log('📦 [MobileOrders] Number of orders:', fetchedOrders.length);
        console.log('📦 [MobileOrders] Order details:', fetchedOrders.map(o => ({
          id: o.id,
          status: o.status,
          trackingId: o.trackingId,
          lastUpdated: o.lastUpdated
        })));
        setOrders(fetchedOrders);
        setOrdersLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setOrdersLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up order subscription');
      unsubscribe();
    };
  }, [user]);

  // Sync selected order with updated orders data (for real-time updates in detail view)
  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const updatedOrder = orders.find(order => order.id === selectedOrder.id);
      if (updatedOrder) {
        console.log('🔄 [MobileOrders] Syncing selected order with real-time data');
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders]);

  // Filter orders based on tab
  const filteredOrders = selectedOrderTab === 'current'
    ? orders.filter(order => ['pending', 'processing', 'shipped', 'outForDelivery'].includes(order.status))
    : orders;

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (date: Date | { seconds: number; nanoseconds: number } | undefined) => {
    if (!date) return 'N/A';
    
    let jsDate: Date;
    if (date instanceof Date) {
      jsDate = date;
    } else if (typeof date === 'object' && 'seconds' in date) {
      jsDate = new Date(date.seconds * 1000);
    } else {
      return 'Invalid Date';
    }

    return jsDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status badge class - sophisticated palette
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'processing': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'outForDelivery': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      case 'returnRequested': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'returnScheduled': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'returned': return 'bg-gray-50 text-gray-700 border border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'processing': return <Package className="w-3.5 h-3.5" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'outForDelivery': return <MapPin className="w-3.5 h-3.5" />;
      case 'delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      case 'returnRequested': return <ReturnIcon className="w-3.5 h-3.5" />;
      case 'returnScheduled': return <ReturnIcon className="w-3.5 h-3.5" />;
      case 'returned': return <ReturnIcon className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'outForDelivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'returnRequested': return 'Return Requested';
      case 'returnScheduled': return 'Return Scheduled';
      case 'returned': return 'Returned';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Check if order can be returned (within 7 days of delivery)
  const canReturnOrder = (order: Order) => {
    if (order.status !== 'delivered' || !order.deliveredAt) return false;

    const deliveredDate = order.deliveredAt instanceof Date 
      ? order.deliveredAt 
      : new Date(order.deliveredAt.seconds * 1000);
    
    const hoursSinceDelivery = (new Date().getTime() - deliveredDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceDelivery <= 168; // 7 days = 168 hours
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder || !user || !cancelReason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    setIsSubmitting(true);
    try {
      await cancelOrder(selectedOrder.id, user.uid, cancelReason);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle return request
  const handleRequestReturn = async () => {
    if (!selectedOrder || !user || !returnReason) {
      toast.error('Please select a return reason');
      return;
    }

    // If "Other reason" is selected, check if custom text is provided
    if (returnReason === 'Other reason' && !customReturnReason.trim()) {
      toast.error('Please provide your reason for return');
      return;
    }

    setIsSubmitting(true);
    try {
      // Use custom reason if "Other reason" is selected, otherwise use the predefined reason
      const finalReason = returnReason === 'Other reason' ? customReturnReason : returnReason;
      await requestReturn(selectedOrder.id, user.uid, finalReason);
      toast.success('Return request submitted successfully. Our team will review it shortly.');
      setShowReturnModal(false);
      setReturnReason('');
      setCustomReturnReason('');
    } catch (error: any) {
      console.error('Error requesting return:', error);
      toast.error(error.message || 'Failed to request return');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    if (method === 'cod') return 'Cash On Delivery';
    if (method === 'online') return 'Online Payment';
    if (method === 'card') return 'Card Payment';
    return method.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Generate receipt image and share
  const generateReceiptImage = async (order: Order): Promise<Blob | null> => {
    if (!receiptRef.current) {
      console.error('Receipt ref is null');
      return null;
    }
    
    try {
      // Get the parent container and temporarily make it visible for capture
      const parentContainer = receiptRef.current.parentElement;
      if (parentContainer) {
        parentContainer.style.opacity = '1';
        parentContainer.style.zIndex = '99999';
      }
      
      // Wait a moment for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        width: 380,
        height: receiptRef.current.scrollHeight,
      });
      
      // Hide the container again
      if (parentContainer) {
        parentContainer.style.opacity = '0';
        parentContainer.style.zIndex = '-9999';
      }
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error generating receipt image:', error);
      // Make sure to hide even on error
      const parentContainer = receiptRef.current?.parentElement;
      if (parentContainer) {
        parentContainer.style.opacity = '0';
        parentContainer.style.zIndex = '-9999';
      }
      return null;
    }
  };

  // Share receipt as image
  const shareReceiptImage = async (platform: 'whatsapp' | 'email' | 'download' | 'native') => {
    if (!selectedOrder) return;
    
    setIsGeneratingImage(true);
    
    try {
      const imageBlob = await generateReceiptImage(selectedOrder);
      
      if (!imageBlob) {
        alert('Failed to generate receipt image. Please try again.');
        setIsGeneratingImage(false);
        return;
      }
      
      const file = new File([imageBlob], `order-receipt-${selectedOrder.orderId}.png`, { type: 'image/png' });
      
      // Helper function to download the image
      const downloadImage = () => {
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `order-receipt-${selectedOrder.orderId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
      
      // Check if native file sharing is supported (mainly mobile devices)
      const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });
      
      if (platform === 'native' && canShareFiles) {
        // Native share with file (mobile)
        await navigator.share({
          title: `Order Receipt - ORD-${selectedOrder.orderId}`,
          files: [file],
        });
      } else if (platform === 'download') {
        // Just download
        downloadImage();
        alert('Receipt image saved to your downloads!');
      } else if (canShareFiles) {
        // Mobile - use native share for all platforms
        await navigator.share({
          title: `Order Receipt - ORD-${selectedOrder.orderId}`,
          files: [file],
        });
      } else {
        // Desktop fallback - download first, then open platform
        downloadImage();
        
        setTimeout(() => {
          if (platform === 'whatsapp') {
            window.open('https://web.whatsapp.com/', '_blank');
            alert('Receipt downloaded! Open WhatsApp and attach the image from your Downloads folder.');
          } else if (platform === 'email') {
            window.open(`mailto:?subject=Order Receipt - ORD-${selectedOrder.orderId}`, '_blank');
            alert('Receipt downloaded! Attach the image from your Downloads folder to the email.');
          } else {
            alert('Receipt image downloaded! You can now share it on any platform.');
          }
        }, 500);
      }
      
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing receipt:', error);
      // If share was cancelled by user, don't show error
      if ((error as Error).name !== 'AbortError') {
        alert('Failed to share receipt. Please try the "Save" option to download the image.');
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Convert number to words for invoice
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convertLessThanThousand = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
    };
    
    const intPart = Math.floor(num);
    let words = '';
    
    if (intPart >= 10000000) {
      words += convertLessThanThousand(Math.floor(intPart / 10000000)) + ' Crore ';
    }
    if (intPart >= 100000) {
      words += convertLessThanThousand(Math.floor((intPart % 10000000) / 100000)) + ' Lakh ';
    }
    if (intPart >= 1000) {
      words += convertLessThanThousand(Math.floor((intPart % 100000) / 1000)) + ' Thousand ';
    }
    if (intPart % 1000 !== 0) {
      words += convertLessThanThousand(intPart % 1000);
    }
    
    return words.trim() + ' Rupees Only';
  };

  // Download Invoice as PDF
  const downloadInvoice = async () => {
    if (!selectedOrder) return;
    
    setIsDownloadingInvoice(true);
    
    try {
      // Create PDF document
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 15;
      
      // Add logo (convert to base64 and add)
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = logoImage;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const logoBase64 = canvas.toDataURL('image/png');
        doc.addImage(logoBase64, 'PNG', margin, yPos, 45, 15);
      } catch (e) {
        // If logo fails, just add text
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(249, 115, 22);
        doc.text('SREE RASTHU SILVERS', margin, yPos + 10);
      }
      
      // Title - Tax Invoice
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Tax Invoice/Bill of Supply', pageWidth - margin, yPos + 5, { align: 'right' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('(Original for Recipient)', pageWidth - margin, yPos + 10, { align: 'right' });
      
      yPos += 25;
      
      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      // Sold By and Billing Address section
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Sold By:', margin, yPos);
      doc.text('Billing Address:', pageWidth / 2 + 10, yPos);
      
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      // Sold By details
      const soldByLines = [
        'Sree Rasthu Silvers',
        'Ramasomayajulu St, Rama Rao Peta',
        'Kakinada, Andhra Pradesh 533001',
        'India',
        'Phone: 63049 60489'
      ];
      soldByLines.forEach((line, idx) => {
        doc.text(line, margin, yPos + (idx * 4));
      });
      
      // Billing Address details
      const billingLines = [
        selectedOrder.shippingAddress.fullName,
        selectedOrder.shippingAddress.address,
        `${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}`,
        `PIN: ${selectedOrder.shippingAddress.pincode}`,
        'India',
        `State/UT Code: ${selectedOrder.shippingAddress.state === 'Andhra Pradesh' ? '37' : '00'}`
      ];
      billingLines.forEach((line, idx) => {
        doc.text(line, pageWidth / 2 + 10, yPos + (idx * 4), { align: 'left' });
      });
      
      yPos += 30;
      
      // Shipping Address section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Shipping Address:', pageWidth / 2 + 10, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      const shippingLines = [
        selectedOrder.shippingAddress.fullName,
        selectedOrder.shippingAddress.address,
        `${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}`,
        `PIN: ${selectedOrder.shippingAddress.pincode}`,
        'India',
        `State/UT Code: ${selectedOrder.shippingAddress.state === 'Andhra Pradesh' ? '37' : '00'}`,
        `Place of Supply: ${selectedOrder.shippingAddress.state}`,
        `Place of Delivery: ${selectedOrder.shippingAddress.state}`
      ];
      shippingLines.forEach((line, idx) => {
        doc.text(line, pageWidth / 2 + 10, yPos + (idx * 4));
      });
      
      yPos += 10;
      
      // Order details on left side
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Order Number: ${selectedOrder.orderId}`, margin, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      const orderDateObj = selectedOrder.createdAt instanceof Date 
        ? selectedOrder.createdAt 
        : new Date((selectedOrder.createdAt as any).seconds * 1000);
      const orderDateStr = orderDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      doc.text(`Order Date: ${orderDateStr}`, margin, yPos);
      
      // Invoice details on right
      const invoiceNum = `INV-${selectedOrder.orderId}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`Invoice Number: ${invoiceNum}`, pageWidth - margin, yPos - 5, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice Date: ${orderDateStr}`, pageWidth - margin, yPos, { align: 'right' });
      
      yPos += 25;
      
      // Helper function for formatting currency without rupee symbol for table
      const formatAmount = (amount: number) => {
        return amount.toFixed(2);
      };
      
      // Items table
      const tableData = selectedOrder.items.map((item, idx) => {
        const netAmount = item.price * item.quantity;
        const taxRate = 3; // 3% GST for jewelry
        const taxAmount = (netAmount * taxRate) / 100;
        return [
          (idx + 1).toString(),
          item.name,
          formatAmount(item.price),
          item.quantity.toString(),
          formatAmount(netAmount),
          `${taxRate}%`,
          'IGST',
          formatAmount(taxAmount),
          formatAmount(netAmount + taxAmount)
        ];
      });
      
      // Add delivery charges row if any
      if (selectedOrder.deliveryCharge > 0) {
        tableData.push([
          (selectedOrder.items.length + 1).toString(),
          'Delivery Charges',
          formatAmount(selectedOrder.deliveryCharge),
          '1',
          formatAmount(selectedOrder.deliveryCharge),
          '0%',
          '-',
          '0.00',
          formatAmount(selectedOrder.deliveryCharge)
        ]);
      }
      
      // Calculate totals
      const totalTax = selectedOrder.taxAmount;
      
      autoTable(doc, {
        startY: yPos,
        head: [['S.No', 'Description', 'Unit Price (Rs)', 'Qty', 'Net Amt (Rs)', 'Tax Rate', 'Tax Type', 'Tax Amt (Rs)', 'Total (Rs)']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontSize: 7,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [50, 50, 50]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 42 },
          2: { halign: 'right', cellWidth: 22 },
          3: { halign: 'center', cellWidth: 10 },
          4: { halign: 'right', cellWidth: 22 },
          5: { halign: 'center', cellWidth: 14 },
          6: { halign: 'center', cellWidth: 14 },
          7: { halign: 'right', cellWidth: 20 },
          8: { halign: 'right', cellWidth: 22 }
        },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
          yPos = data.cursor?.y || yPos + 50;
        }
      });
      
      yPos = (doc as any).lastAutoTable?.finalY || yPos + 50;
      yPos += 5;
      
      // TOTAL row
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - (2 * margin), 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TOTAL:', margin + 5, yPos + 5.5);
      doc.text(totalTax.toFixed(2), pageWidth - margin - 45, yPos + 5.5, { align: 'right' });
      doc.text('Rs. ' + selectedOrder.total.toFixed(2), pageWidth - margin - 5, yPos + 5.5, { align: 'right' });
      
      yPos += 15;
      
      // Amount in Words
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Amount in Words:', margin, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(numberToWords(selectedOrder.total), margin, yPos);
      
      yPos += 15;
      
      // Authorized Signatory box
      const sigBoxWidth = 70;
      const sigBoxHeight = 25;
      const sigBoxX = pageWidth - margin - sigBoxWidth;
      
      doc.setDrawColor(150, 150, 150);
      doc.rect(sigBoxX, yPos, sigBoxWidth, sigBoxHeight);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('For Sree Rasthu Silvers:', sigBoxX + 5, yPos + 6);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Authorized Signatory', sigBoxX + sigBoxWidth / 2, yPos + 20, { align: 'center' });
      
      yPos += sigBoxHeight + 10;
      
      // Tax note
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Whether tax is payable under reverse charge - No', margin, yPos);
      
      yPos += 10;
      
      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
      
      doc.setFontSize(6);
      doc.setTextColor(120, 120, 120);
      const footerText = 'This is a computer generated invoice and does not require a physical signature. For any queries, contact us at +91 98198 73745 or support@sreerasthusilvers.com';
      doc.text(footerText, pageWidth / 2, yPos, { align: 'center', maxWidth: pageWidth - (2 * margin) });
      
      // Save the PDF
      doc.save(`Invoice-${selectedOrder.orderId}.pdf`);
      
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

    return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 px-4 py-4 flex items-center shadow-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <button
          onClick={() => navigate('/account')}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="ml-3 text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>My Orders</h1>
      </div>

      {/* Order Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 sticky top-[60px] z-40" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedOrderTab('current')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              selectedOrderTab === 'current'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setSelectedOrderTab('all')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              selectedOrderTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            All orders
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {ordersLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
              onClick={() => {
                setSelectedOrder(order);
                setShowOrderModal(true);
              }}
            >
              {/* Order Items Display */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.name}</h4>
                      <p className="text-xs text-gray-600">Price: {formatPrice(item.price)}</p>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* OTP Display for Out for Delivery Orders */}
              {order.status === 'outForDelivery' && order.delivery_otp && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-900">Delivery OTP</p>
                  <p className="text-xs text-gray-600 mt-0.5">Share this OTP with your delivery partner</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{order.delivery_otp}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Order Detail Full Page */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Order Details</h2>
            </div>

            {/* Content */}
            <div className="pb-24">
              {/* Tracking ID Banner */}
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <p className="text-sm text-blue-700">
                  Order can be tracked by <span className="font-semibold">ORD-{selectedOrder.orderId}</span>
                  {selectedOrder.trackingId && (
                    <span className="block mt-1 text-xs">Tracking ID: {selectedOrder.trackingId}</span>
                  )}
                </p>
              </div>

              {/* Product Card */}
              <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                    <img 
                      src={selectedOrder.items[0]?.image} 
                      alt={selectedOrder.items[0]?.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedOrder.items.length > 1 
                        ? `${selectedOrder.items[0]?.name} +${selectedOrder.items.length - 1} more`
                        : selectedOrder.items[0]?.name
                      }
                    </h3>
                    <p className="text-base font-bold text-gray-900 mt-1">₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="bg-white px-4 py-5 border-b border-gray-100">
                <OrderStatusStepper status={selectedOrder.status} />
              </div>

              {/* Current Status Card */}
              <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedOrder.status === 'delivered' ? 'bg-emerald-100' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-100' :
                    selectedOrder.status === 'returnRequested' ? 'bg-amber-100' :
                    selectedOrder.status === 'returnScheduled' ? 'bg-emerald-100' :
                    selectedOrder.status === 'returned' ? 'bg-gray-100' :
                    'bg-blue-100'
                  }`}>
                    {selectedOrder.status === 'delivered' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : selectedOrder.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : selectedOrder.status === 'returnRequested' ? (
                      <ReturnIcon className="w-5 h-5 text-amber-600" />
                    ) : selectedOrder.status === 'returnScheduled' ? (
                      <ReturnIcon className="w-5 h-5 text-emerald-600" />
                    ) : selectedOrder.status === 'returned' ? (
                      <CheckCircle2 className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Package className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{getStatusLabel(selectedOrder.status)}</h4>
                    {selectedOrder.carrier && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {selectedOrder.carrier}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedOrder.status === 'pending' && 'Your order has been placed successfully'}
                      {selectedOrder.status === 'processing' && 'Package is being prepared for shipment'}
                      {selectedOrder.status === 'shipped' && 'Package has left the warehouse'}
                      {selectedOrder.status === 'outForDelivery' && 'Package is out for delivery'}
                      {selectedOrder.status === 'delivered' && 'Package has been delivered'}
                      {selectedOrder.status === 'cancelled' && 'Order has been cancelled'}
                      {selectedOrder.status === 'returnRequested' && 'Return request submitted. Waiting for approval.'}
                      {selectedOrder.status === 'returnScheduled' && 'Return approved! Pickup will be scheduled soon.'}
                      {selectedOrder.status === 'returned' && 'Item has been picked up and returned successfully.'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Delivery Verification - Shown when out for delivery */}
              {selectedOrder.status === 'outForDelivery' && selectedOrder.delivery_otp && (
                <div className="bg-white px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-900">Delivery OTP</p>
                  <p className="text-xs text-gray-600 mt-0.5">Share this OTP with your delivery partner</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedOrder.delivery_otp}</p>
                </div>
              )}

              {/* Delivery Message */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && 
               selectedOrder.status !== 'returnRequested' && selectedOrder.status !== 'returnScheduled' && 
               selectedOrder.status !== 'returned' && (
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <p className="text-sm text-amber-800">
                    {selectedOrder.status === 'shipped' || selectedOrder.status === 'outForDelivery'
                      ? "Yayy! your item is on the way. It will reach you soon."
                      : "Your order is being processed. We'll notify you once it's shipped."
                    }
                  </p>
                </div>
              )}

              {/* Delivery Executive Info */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">Delivery Executive details</span> will be available once the order is out for delivery
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white px-4 py-4 flex gap-3 border-b border-gray-100">
                {/* Cancel Button - Only for pending/processing orders */}
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 py-2.5 px-4 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}

                {/* Return Button - Only for delivered orders within 7 days */}
                {canReturnOrder(selectedOrder) && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="flex-1 py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-medium text-emerald-700 flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                  >
                    <ReturnIcon className="w-4 h-4" />
                    Return Items
                  </button>
                )}

                {/* Chat Button - Always show */}
                <button 
                  onClick={() => {
                    const phoneNumber = '919819873745';
                    const message = encodeURIComponent(
                      `Hello! I need assistance regarding my order:\n\nOrder ID: ORD-${selectedOrder.orderId}\nProduct: ${selectedOrder.items[0]?.name}${selectedOrder.items.length > 1 ? ` +${selectedOrder.items.length - 1} more items` : ''}\nStatus: ${getStatusLabel(selectedOrder.status)}\n\nPlease help me with my product enquiry.`
                    );
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                  }}
                  className="flex-1 py-2.5 px-4 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with us
                </button>
              </div>

              {/* Track Package Button */}
              {selectedOrder.trackingUrl && (
                <div className="bg-white px-4 py-3 border-b border-gray-100">
                  <a
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl"
                  >
                    <Truck className="w-4 h-4" />
                    Track Package
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Delivery Details Section */}
              <div className="bg-white mt-2 border-t border-b border-gray-100">
                <h3 className="px-4 py-3 text-base font-semibold text-gray-900 border-b border-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery details</h3>
                
                {/* Delivery Address */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600">Delivery Address</p>
                    <p className="text-xs text-gray-600 truncate">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* Customer Info */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {selectedOrder.shippingAddress.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-xs text-gray-500">ORD-{selectedOrder.orderId}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>

              {/* Price Details Section */}
              <div className="bg-white mt-2 border-t border-b border-gray-100">
                <h3 className="px-4 py-3 text-base font-semibold text-gray-900 border-b border-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>Price details</h3>
                
                <div className="px-4 py-3 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Selling price</span>
                    <span className="text-gray-900">₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total fees</span>
                    <span className="text-gray-900">₹{(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="text-base font-semibold text-blue-600">Total amount</span>
                    <span className="text-base font-bold text-gray-900">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Share Order Details */}
              <div className="bg-white mt-2 px-4 py-3 border-t border-gray-100">
                <button 
                  onClick={() => setShowShareMenu(true)}
                  className="w-full flex items-center justify-between text-sm text-gray-700 font-medium py-2"
                >
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-gray-500" />
                    <span>Share Order Details</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Download Invoice */}
              <div className="bg-white px-4 py-3 border-b border-gray-100">
                <button 
                  onClick={() => downloadInvoice()}
                  disabled={isDownloadingInvoice}
                  className="w-full flex items-center justify-between text-sm text-gray-700 font-medium py-2 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <span className="block">Download Invoice</span>
                      <span className="text-xs text-gray-400">Order ID: {selectedOrder.orderId}</span>
                    </div>
                  </div>
                  {isDownloadingInvoice ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Feedback */}
              <div className="bg-white mt-2 px-4 py-4 border-t border-b border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-500">
                  Did you find this page helpful?
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Receipt Component for Image Generation */}
      {selectedOrder && (
        <div style={{ 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          zIndex: -9999,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <div
            ref={receiptRef}
            style={{
              width: '380px',
              padding: '24px',
              backgroundColor: '#ffffff',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #f97316', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#f97316', margin: 0 }}>SREE RASTHU SILVERS</h1>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0 0' }}>92.5% Pure Silver Jewelry</p>
            </div>

            {/* Receipt Title */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>ORDER RECEIPT</h2>
            </div>

            {/* Order Info */}
            <div style={{ backgroundColor: '#fff7ed', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Order ID:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>ORD-{selectedOrder.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Date:</span>
                <span style={{ fontSize: '12px', color: '#1f2937' }}>{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Status:</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#f97316' }}>{getStatusLabel(selectedOrder.status)}</span>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '6px' }}>Items Ordered</h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', paddingBottom: '10px', borderBottom: idx < selectedOrder.items.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937', margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>₹{(item.quantity * item.price).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '10px' }}>Price Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Selling Price</span>
                <span style={{ fontSize: '12px', color: '#1f2937' }}>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#16a34a' }}>Discount</span>
                  <span style={{ fontSize: '12px', color: '#16a34a' }}>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Fees</span>
                <span style={{ fontSize: '12px', color: '#1f2937' }}>₹{(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #f97316' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#f97316' }}>Total Amount</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment & Delivery */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Payment:</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>{formatPaymentMethod(selectedOrder.paymentMethod)}</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Delivery Address:</p>
                <p style={{ fontSize: '12px', color: '#1f2937', margin: 0, lineHeight: '1.4' }}>
                  {selectedOrder.shippingAddress.fullName}<br />
                  {selectedOrder.shippingAddress.address}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                  PIN: {selectedOrder.shippingAddress.pincode}<br />
                  Mobile: {selectedOrder.shippingAddress.mobile}
                </p>
              </div>
            </div>

            {/* Tracking Info */}
            {(selectedOrder.trackingId || selectedOrder.carrier) && (
              <div style={{ backgroundColor: '#eff6ff', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#1d4ed8', marginBottom: '6px' }}>Tracking Information</p>
                {selectedOrder.trackingId && <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 4px 0' }}>ID: {selectedOrder.trackingId}</p>}
                {selectedOrder.carrier && <p style={{ fontSize: '11px', color: '#4b5563', margin: 0 }}>Carrier: {selectedOrder.carrier}</p>}
              </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>Thank you for shopping with us! 🎉</p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 8px 0' }}>For support: +91 98198 73745</p>
              <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>www.sreerasthusilvers.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      <AnimatePresence>
        {showShareMenu && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-end"
            onClick={() => setShowShareMenu(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full rounded-t-3xl p-6 pb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Share Order Details</h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Generating Image Indicator */}
              {isGeneratingImage && (
                <div className="flex items-center justify-center py-4 mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
                  <span className="text-sm text-gray-600">Generating receipt image...</span>
                </div>
              )}

              {/* Share Options Grid */}
              <div className="grid grid-cols-4 gap-4">
                {/* WhatsApp */}
                <button
                  onClick={() => shareReceiptImage('whatsapp')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-700">WhatsApp</span>
                </button>

                {/* Gmail */}
                <button
                  onClick={() => shareReceiptImage('email')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-xs text-gray-700">Gmail</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => shareReceiptImage('native')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-pink-600" />
                  </div>
                  <span className="text-xs text-gray-700">Instagram</span>
                </button>

                {/* Download Image */}
                <button
                  onClick={() => shareReceiptImage('download')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Download className="w-7 h-7 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-700">Save</span>
                </button>

                {/* Facebook Messenger */}
                <button
                  onClick={() => shareReceiptImage('native')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-700">Messenger</span>
                </button>

                {/* SMS */}
                <button
                  onClick={() => shareReceiptImage('native')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-green-700" />
                  </div>
                  <span className="text-xs text-gray-700">SMS</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => shareReceiptImage('native')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-sky-600" />
                  </div>
                  <span className="text-xs text-gray-700">Telegram</span>
                </button>

                {/* More (Native Share) */}
                <button
                  onClick={() => shareReceiptImage('native')}
                  disabled={isGeneratingImage}
                  className="flex flex-col items-center gap-2 disabled:opacity-50"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-700">More</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[99999] flex items-end sm:items-center sm:justify-center p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                </div>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Please select a reason for cancelling this order:
                </p>

                <div className="space-y-2">
                  {[
                    'Changed my mind',
                    'Ordered by mistake',
                    'Found a better price',
                    'Need to change delivery address',
                    'Other reason'
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setCancelReason(reason)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        cancelReason === reason
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{reason}</span>
                    </button>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCancelOrder}
                  disabled={!cancelReason || isSubmitting}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                    !cancelReason || isSubmitting
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return Request Modal - Full Page */}
      <AnimatePresence>
        {showReturnModal && selectedOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white z-[99999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason('');
                  setCustomReturnReason('');
                }}
                className="w-8 h-8 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Request Return</h3>
            </div>

            {/* Product Info */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedOrder.items[0]?.image} 
                    alt={selectedOrder.items[0]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {selectedOrder.items[0]?.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Quantity: {selectedOrder.items[0]?.quantity}
                  </p>
                  <p className="text-base font-bold text-gray-900 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    ₹{selectedOrder.items[0]?.price?.toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedOrder.items.length > 1 && (
                <p className="text-xs text-gray-500 mt-2 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  +{selectedOrder.items.length - 1} more items will be included in this return
                </p>
              )}
            </div>

            {/* Return Reasons Grid */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Reason for return</h4>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { 
                    reason: 'Quality not as expected', 
                    icon: '😞',
                    description: 'Quality of the product not as expected'
                  },
                  { 
                    reason: 'Received wrong item', 
                    icon: '📦',
                    description: 'Received wrong item'
                  },
                  { 
                    reason: "Don't want anymore", 
                    icon: '🤔',
                    description: "Don't want the product anymore"
                  },
                  { 
                    reason: 'Missing in package', 
                    icon: '📭',
                    description: 'Product is missing in the package'
                  },
                  { 
                    reason: 'Damaged/Broken item', 
                    icon: '💔',
                    description: 'Received a broken/damaged item'
                  },
                  { 
                    reason: "Size/Fit issue", 
                    icon: '👎',
                    description: "Don't like the size/fit of the product"
                  },
                ].map((item) => (
                  <button
                    key={item.reason}
                    onClick={() => {
                      setReturnReason(item.reason);
                      setCustomReturnReason('');
                    }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      returnReason === item.reason
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl mb-2">{item.icon}</span>
                    <span className={`text-xs text-center leading-tight ${
                      returnReason === item.reason ? 'text-amber-700 font-medium' : 'text-gray-600'
                    }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>

              {/* Other Reason Option */}
              <button
                onClick={() => setReturnReason('Other reason')}
                className={`w-full mt-3 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  returnReason === 'Other reason'
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">✏️</span>
                <span className={`text-sm ${
                  returnReason === 'Other reason' ? 'text-amber-700 font-medium' : 'text-gray-600'
                }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Other reason
                </span>
              </button>

              {/* Custom Reason Input - Shows when "Other reason" is selected */}
              {returnReason === 'Other reason' && (
                <div className="mt-3">
                  <textarea
                    value={customReturnReason}
                    onChange={(e) => setCustomReturnReason(e.target.value)}
                    placeholder="Please describe your reason for return..."
                    rows={4}
                    maxLength={200}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-400 bg-amber-50 text-gray-900 placeholder-gray-500 resize-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    autoFocus
                  />
                  <p className="text-xs text-amber-700 mt-1 ml-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {customReturnReason.length}/200 characters
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="px-4 py-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleRequestReturn}
                disabled={!returnReason || (returnReason === 'Other reason' && !customReturnReason.trim()) || isSubmitting}
                className={`w-full py-4 rounded-full font-semibold text-base transition-all ${
                  !returnReason || (returnReason === 'Other reason' && !customReturnReason.trim()) || isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Status Stepper Component
const OrderStatusStepper = ({ status }: { status: string }) => {
  // Check if this is a return flow
  const isReturnFlow = ['returnRequested', 'returnScheduled', 'returned'].includes(status);
  
  // Normal order steps
  const orderSteps = [
    { key: 'pending', label: 'Order\nPlaced' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'outForDelivery', label: 'Out for\nDelivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  // Return flow steps
  const returnSteps = [
    { key: 'returnRequested', label: 'Return\nRequested' },
    { key: 'returnScheduled', label: 'Return\nScheduled' },
    { key: 'returned', label: 'Picked Up' },
  ];

  const steps = isReturnFlow ? returnSteps : orderSteps;

  const getStepIndex = (currentStatus: string) => {
    const index = steps.findIndex(s => s.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentIndex = getStepIndex(status);
  const isCancelled = status === 'cancelled';

  // For return flow, use emerald color scheme
  const activeColor = isReturnFlow ? 'bg-emerald-500' : 'bg-blue-500';
  const activeBorder = isReturnFlow ? 'border-emerald-500' : 'border-blue-500';
  const activeText = isReturnFlow ? 'text-emerald-600' : 'text-blue-600';
  const activeDot = isReturnFlow ? 'bg-emerald-500' : 'bg-blue-500';

  return (
    <div className="flex items-start justify-between relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Progress Line Background */}
      <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />
      
      {/* Progress Line Active */}
      <div 
        className={`absolute top-4 left-6 h-0.5 z-0 transition-all duration-500 ${isCancelled ? 'bg-red-500' : activeColor}`}
        style={{ 
          width: isCancelled ? '0%' : `calc(${(currentIndex / (steps.length - 1)) * 100}% - 12px)`,
        }}
      />
      
      {steps.map((step, index) => {
        const isCompleted = !isCancelled && index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;
        
        return (
          <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: `${100 / steps.length}%`, fontFamily: "'Poppins', sans-serif" }}>
            {/* Step Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isCancelled 
                ? 'bg-gray-100 border-gray-300'
                : isCompleted 
                  ? `${activeColor} ${activeBorder}` 
                  : 'bg-white border-gray-300'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${isCurrent ? activeDot : 'bg-gray-300'}`} />
              )}
            </div>
            
            {/* Step Label */}
            <p className={`text-[10px] text-center mt-2 leading-tight whitespace-pre-line ${
              isCompleted ? `${activeText} font-medium` : 'text-gray-400'
            }`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MobileOrders;
