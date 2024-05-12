﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Server.Domain;

#nullable disable

namespace Server.Domain.Migrations
{
    [DbContext(typeof(BookRepoContext))]
    [Migration("20240512161104_AddInitialModels")]
    partial class AddInitialModels
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("BookshelfCustomerBook", b =>
                {
                    b.Property<Guid>("BookshelvesId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BooksCustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("BooksIsbn")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("BookshelvesId", "BooksCustomerId", "BooksIsbn");

                    b.HasIndex("BooksCustomerId", "BooksIsbn");

                    b.ToTable("BookshelfCustomerBook");
                });

            modelBuilder.Entity("Server.Domain.Models.Book", b =>
                {
                    b.Property<string>("Isbn")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Picture")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Release")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Isbn");

                    b.ToTable("Books");
                });

            modelBuilder.Entity("Server.Domain.Models.Bookshelf", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("CreationDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<Guid?>("CustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset>("UpdatedDate")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Bookshelves");
                });

            modelBuilder.Entity("Server.Domain.Models.Customer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTimeOffset>("CreationDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("CustomerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId")
                        .IsUnique();

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("Server.Domain.Models.CustomerBook", b =>
                {
                    b.Property<Guid>("CustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Isbn")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int?>("Rating")
                        .HasColumnType("int");

                    b.HasKey("CustomerId", "Isbn");

                    b.ToTable("CustomerBook");
                });

            modelBuilder.Entity("BookshelfCustomerBook", b =>
                {
                    b.HasOne("Server.Domain.Models.Bookshelf", null)
                        .WithMany()
                        .HasForeignKey("BookshelvesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Server.Domain.Models.CustomerBook", null)
                        .WithMany()
                        .HasForeignKey("BooksCustomerId", "BooksIsbn")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Server.Domain.Models.Bookshelf", b =>
                {
                    b.HasOne("Server.Domain.Models.Customer", null)
                        .WithMany("Bookshelves")
                        .HasForeignKey("CustomerId");
                });

            modelBuilder.Entity("Server.Domain.Models.Customer", b =>
                {
                    b.Navigation("Bookshelves");
                });
#pragma warning restore 612, 618
        }
    }
}
